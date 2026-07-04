export interface PatchBlock {
  search: string;
  replace: string;
  originalText: string;
}

export interface ApplyResult {
  success: boolean;
  message: string;
  type: 'full-html' | 'patch' | 'error';
  blocksProcessed: number;
  blocksSucceeded: number;
  failedBlocks: {
    index: number;
    searchSnippet: string;
    error: string;
  }[];
}

export interface UndoItem {
  code: string;
  timestamp: string;
  label: string;
}
