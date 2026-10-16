import type {Entry} from './browseData';
import {searchBrowseDictionaryOnMainThread} from './browseMainThread';
export type BrowseEntry = Entry & {matchLabel?:string;matchEvidence?:string};
export type BrowseOptions = {query:string;scope:string;ignoreMarks:boolean;initial:string;bohairicOnly:boolean;examplesOnly:boolean;pos:string;suggestions:boolean};
export type BrowseResult = {entries:BrowseEntry[];total:number;suggestions:string[]};
export const BROWSE_BATCH_SIZE=24;
let worker:Worker|null=null,sequence=0,workerFailed=false;
let idleTimer:ReturnType<typeof setTimeout>|undefined;
type PendingRequest={resolve:(result:BrowseResult)=>void;reject:(error:Error)=>void;options:BrowseOptions;offset:number};
const pending=new Map<number,PendingRequest>();
// Keep the small first pages when returning from an entry or search settings.
const firstPages=new Map<string,BrowseResult>();
export function peekBrowseDictionary(options:BrowseOptions){return firstPages.get(JSON.stringify(options));}

function runMainThreadFallback(request:PendingRequest){
  void searchBrowseDictionaryOnMainThread(request.options,request.offset,BROWSE_BATCH_SIZE)
    .then(request.resolve,request.reject);
}

function handleWorkerFailure(error:Error,failedRequest?:PendingRequest){
  if(workerFailed)return;
  workerFailed=true;
  worker?.terminate();worker=null;
  clearTimeout(idleTimer);
  console.error('[dictionary] Search worker failed; retrying with the complete dictionary on the main thread.',error);
  const requests=[...pending.values()];pending.clear();
  if(failedRequest&&!requests.includes(failedRequest))requests.push(failedRequest);
  for(const request of requests)runMainThreadFallback(request);
}

export function searchBrowseDictionary(options:BrowseOptions,offset:number):Promise<BrowseResult>{
  const key=JSON.stringify(options);
  if(offset===0&&firstPages.has(key))return Promise.resolve(firstPages.get(key)!);
  return new Promise((resolve,reject)=>{
    const request:PendingRequest={resolve:result=>{
      if(offset===0){
        firstPages.delete(key);firstPages.set(key,result);
        if(firstPages.size>12)firstPages.delete(firstPages.keys().next().value!);
      }
      resolve(result);
    },reject,options,offset};
    if(workerFailed){runMainThreadFallback(request);return;}

    try{
      if(!worker){
        worker=new Worker(new URL('./browse.worker.ts',import.meta.url));
        worker.onmessage=event=>{
          const response=pending.get(event.data.id);
          if(!response)return;
          pending.delete(event.data.id);
          if(event.data.error){handleWorkerFailure(new Error(event.data.error),response);return;}
          response.resolve(event.data.result);
          clearTimeout(idleTimer);
          idleTimer=setTimeout(()=>{if(!pending.size){worker?.terminate();worker=null;}},60000);
        };
        worker.onerror=event=>{
          event.preventDefault();
          const location=event.filename?` at ${event.filename}:${event.lineno}:${event.colno}`:'';
          const detail=event.message?`${event.message}${location}`:`The browser could not start the dictionary worker${location}.`;
          handleWorkerFailure(new Error(detail));
        };
      }
      const id=++sequence;
      clearTimeout(idleTimer);
      pending.set(id,request);
      worker.postMessage({id,options,offset,limit:BROWSE_BATCH_SIZE});
    }catch(error){handleWorkerFailure(error instanceof Error?error:new Error(String(error)),request);}
  });
}
