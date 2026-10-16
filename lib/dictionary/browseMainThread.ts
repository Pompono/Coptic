import {indexSearchEntry, searchDictionary, suggestDictionary} from './search.mjs';
import {prepareBrowseEntries} from './browseData';
import type {BrowseOptions, BrowseResult} from './browseClient';

type SearchIndex = ReturnType<typeof indexSearchEntry>[];

let prepared: Promise<SearchIndex> | null = null;

async function fetchDictionary(path: string) {
  const response = await fetch(path, {cache: 'no-store'});
  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}.`);
  }

  try {
    return await response.json();
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`${path} returned invalid JSON: ${detail}`);
  }
}

function loadIndex() {
  return prepared ??= Promise.all([
    fetchDictionary('/bohairic_dictionary.json'),
    fetchDictionary('/coptic_dictionary_combined.json'),
  ]).then(([bohairic, combined]) => {
    if (!Array.isArray(bohairic) || !Array.isArray(combined)) {
      throw new Error('Dictionary responses must both be JSON arrays.');
    }

    try {
      return prepareBrowseEntries(bohairic, combined).map(indexSearchEntry);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      throw new Error(`Dictionary entries could not be prepared or indexed: ${detail}`);
    }
  }).catch(error => {
    prepared = null;
    throw error;
  });
}

export async function searchBrowseDictionaryOnMainThread(
  options: BrowseOptions,
  offset: number,
  limit: number,
): Promise<BrowseResult> {
  const index = await loadIndex();
  const allMatches = searchDictionary(index, {...options, pos: ''});
  const entries = options.pos ? allMatches.filter(entry => entry.normalizedPos === options.pos) : allMatches;
  const hasGoodMatch = entries.some(entry => entry.matchRank <= 12);
  return {
    entries: entries.slice(offset, offset + limit),
    total: entries.length,
    suggestions: options.suggestions && !hasGoodMatch ? suggestDictionary(index, options) : [],
  };
}
