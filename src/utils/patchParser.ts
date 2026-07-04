import { PatchBlock, ApplyResult } from '../types';

export function normalizeNewlines(str: string): string {
  if (!str) return '';
  return str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Detects the type of content pasted
 */
export function detectContentType(text: string): 'full-html' | 'patch' | 'unknown' {
  const normalized = normalizeNewlines(text);
  
  // If it has SEARCH and REPLACE marker blocks, it's a patch
  if (normalized.includes('<<<<<<< SEARCH') && normalized.includes('>>>>>>> REPLACE')) {
    return 'patch';
  }
  
  // If it looks like HTML (has standard HTML structure or tags)
  const hasHtmlTag = /<[a-z][\s\S]*>/i.test(normalized);
  const hasDoctype = normalized.toLowerCase().includes('<!doctype') || normalized.toLowerCase().includes('<html');
  
  if (hasDoctype || hasHtmlTag) {
    return 'full-html';
  }
  
  return 'unknown';
}

/**
 * Parses individual patch blocks from a text input
 */
export function parsePatches(text: string): PatchBlock[] {
  const normalized = normalizeNewlines(text);
  const blocks: PatchBlock[] = [];
  
  let pos = 0;
  while (true) {
    const searchIdx = normalized.indexOf('<<<<<<< SEARCH', pos);
    if (searchIdx === -1) break;
    
    const dividerIdx = normalized.indexOf('=======', searchIdx);
    if (dividerIdx === -1) {
      pos = searchIdx + 14;
      continue;
    }
    
    const replaceIdx = normalized.indexOf('>>>>>>> REPLACE', dividerIdx);
    if (replaceIdx === -1) {
      pos = dividerIdx + 7;
      continue;
    }
    
    // Extract SEARCH content
    let searchStart = searchIdx + 14;
    if (normalized[searchStart] === '\n') searchStart++;
    
    let searchEnd = dividerIdx;
    if (normalized[searchEnd - 1] === '\n') searchEnd--;
    
    const searchVal = normalized.substring(searchStart, searchEnd);
    
    // Extract REPLACE content
    let replaceStart = dividerIdx + 7;
    if (normalized[replaceStart] === '\n') replaceStart++;
    
    let replaceEnd = replaceIdx;
    if (normalized[replaceEnd - 1] === '\n') replaceEnd--;
    
    const replaceVal = normalized.substring(replaceStart, replaceEnd);
    
    blocks.push({
      search: searchVal,
      replace: replaceVal,
      originalText: normalized.substring(searchIdx, replaceIdx + 15)
    });
    
    pos = replaceIdx + 15;
  }
  
  return blocks;
}

/**
 * Applies full HTML or patch blocks to current HTML code.
 * Returns detailed execution summary.
 */
export function applyChanges(currentCode: string, inputText: string): ApplyResult {
  const type = detectContentType(inputText);
  
  if (type === 'unknown') {
    return {
      success: false,
      message: 'Format kandungan tidak dikenali. Sila pastikan anda paste HTML penuh (cth. ada tag <html>) atau blok patch (format <<<<<<< SEARCH) yang sah dari AI anda.',
      type: 'error',
      blocksProcessed: 0,
      blocksSucceeded: 0,
      failedBlocks: []
    };
  }
  
  if (type === 'full-html') {
    return {
      success: true,
      message: 'HTML penuh berjaya dimuatkan dan dipaparkan!',
      type: 'full-html',
      blocksProcessed: 0,
      blocksSucceeded: 0,
      failedBlocks: []
    };
  }
  
  // It's a patch. Check if we have current code to patch.
  const normalizedCurrent = normalizeNewlines(currentCode).trim();
  if (!normalizedCurrent) {
    return {
      success: false,
      message: 'Tiada laman web sedia ada. Sila paste HTML penuh terlebih dahulu untuk memulakan tapak web anda.',
      type: 'error',
      blocksProcessed: 0,
      blocksSucceeded: 0,
      failedBlocks: []
    };
  }
  
  const patches = parsePatches(inputText);
  if (patches.length === 0) {
    return {
      success: false,
      message: 'Blok patch tidak sah. Pastikan format <<<<<<< SEARCH, =======, dan >>>>>>> REPLACE ditulis dengan betul.',
      type: 'error',
      blocksProcessed: 0,
      blocksSucceeded: 0,
      failedBlocks: []
    };
  }
  
  let tempCode = normalizeNewlines(currentCode);
  let succeededCount = 0;
  const failedBlocks: { index: number; searchSnippet: string; error: string; }[] = [];
  
  patches.forEach((patch, idx) => {
    // Exact string search
    const normalizedSearch = patch.search;
    const normalizedReplace = patch.replace;
    
    const searchIndex = tempCode.indexOf(normalizedSearch);
    
    if (searchIndex !== -1) {
      // Find and replace ONLY the first occurrence or all?
      // Git-style conflict markers/patches usually replace specific matched locations.
      // We do a single replacement at the index found.
      tempCode = tempCode.substring(0, searchIndex) + normalizedReplace + tempCode.substring(searchIndex + normalizedSearch.length);
      succeededCount++;
    } else {
      // Failed to match. Let's provide a helpful snippet.
      const searchSnippet = patch.search.length > 60 
        ? patch.search.substring(0, 60) + '...'
        : patch.search;
        
      failedBlocks.push({
        index: idx + 1,
        searchSnippet,
        error: 'Kod asal (SEARCH) tidak sepadan dengan kod semasa.'
      });
    }
  });
  
  if (succeededCount === patches.length) {
    return {
      success: true,
      message: `Semua ${patches.length} patch berjaya diterapkan pada kod laman web anda!`,
      type: 'patch',
      blocksProcessed: patches.length,
      blocksSucceeded: succeededCount,
      failedBlocks: []
    };
  } else if (succeededCount > 0) {
    return {
      success: true, // we still applied some patches, so it's a partial success
      message: `${succeededCount} daripada ${patches.length} patch berjaya diterapkan. Ada bahagian yang tidak sepadan.`,
      type: 'patch',
      blocksProcessed: patches.length,
      blocksSucceeded: succeededCount,
      failedBlocks
    };
  } else {
    return {
      success: false,
      message: 'Gagal menerapkan sebarang patch. Sila semak semula kod carian (SEARCH) anda dengan AI.',
      type: 'patch',
      blocksProcessed: patches.length,
      blocksSucceeded: 0,
      failedBlocks
    };
  }
}
