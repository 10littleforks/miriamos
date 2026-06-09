import type { FsNode } from './types';

const KEY = 'miriamos.fs';

export function saveTree(tree: FsNode[]): void {
  localStorage.setItem(KEY, JSON.stringify(tree));
}

export function loadTree(): FsNode[] | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as FsNode[];
  } catch {
    return null;
  }
}
