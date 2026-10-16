import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {loadTsModule} from './tsModule.mjs';

test('main-thread fallback loads, retains, indexes, and searches production dictionary data', async () => {
  const {searchBrowseDictionaryOnMainThread} = await loadTsModule('lib/dictionary/browseMainThread.ts');
  const bohairic = JSON.parse(await readFile('public/bohairic_dictionary.json', 'utf8'));
  const combined = JSON.parse(await readFile('public/coptic_dictionary_combined.json', 'utf8'));
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async input => {
    const name = new URL(String(input), 'http://localhost').pathname.slice(1);
    const file = name === 'bohairic_dictionary.json'
      ? 'public/bohairic_dictionary.json'
      : name === 'coptic_dictionary_combined.json'
        ? 'public/coptic_dictionary_combined.json'
        : null;
    if (!file) throw new Error(`Unexpected dictionary URL: ${String(input)}`);
    return new Response(await readFile(file, 'utf8'), {status: 200, headers: {'content-type': 'application/json'}});
  };

  try {
    const all = await searchBrowseDictionaryOnMainThread({
      query: '', scope: 'all', ignoreMarks: true, initial: '', bohairicOnly: false,
      examplesOnly: false, pos: '', suggestions: true,
    }, 0, 24);
    assert.equal(all.total, bohairic.length + combined.length, 'all source rows remain searchable');
    assert.equal(all.entries.length, 24);

    const coptic = await searchBrowseDictionaryOnMainThread({
      query: 'ⲁ', scope: 'coptic', ignoreMarks: true, initial: '', bohairicOnly: true,
      examplesOnly: false, pos: '', suggestions: true,
    }, 0, 24);
    assert.ok(coptic.entries.some(entry => entry.lemma === 'ⲁ'), 'Bohairic headwords are searchable');

    const english = await searchBrowseDictionaryOnMainThread({
      query: 'strap', scope: 'english', ignoreMarks: true, initial: '', bohairicOnly: false,
      examplesOnly: false, pos: '', suggestions: true,
    }, 0, 24);
    assert.ok(english.entries.some(entry => entry.lemma === 'ⲁⲃⲉ'), 'combined lexicon glosses are searchable');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('dictionary worker startup failure falls back to production data search', async () => {
  const {loadTsModule} = await import('./tsModule.mjs');
  const {searchBrowseDictionary} = await loadTsModule('lib/dictionary/browseClient.ts');
  const originalWorker = globalThis.Worker;
  const originalConsoleError = console.error;
  class FailingWorker {
    onerror;
    onmessage;
    postMessage() {
      queueMicrotask(() => this.onerror?.({
        message: 'simulated worker bootstrap failure',
        filename: '/worker.js',
        lineno: 1,
        colno: 1,
        preventDefault() {},
      }));
    }
    terminate() {}
  }
  globalThis.Worker = FailingWorker;
  console.error = () => {};

  try {
    const result = await searchBrowseDictionary({
      query: 'strap', scope: 'english', ignoreMarks: true, initial: '', bohairicOnly: false,
      examplesOnly: false, pos: '', suggestions: true,
    }, 0);
    assert.ok(result.total > 0);
    assert.ok(result.entries.some(entry => entry.lemma === 'ⲁⲃⲉ'));
  } finally {
    globalThis.Worker = originalWorker;
    console.error = originalConsoleError;
  }
});
