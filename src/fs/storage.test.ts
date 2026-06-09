import { describe, it, expect, beforeEach } from 'vitest';
import { loadTree, saveTree } from './storage';
import type { FsNode } from './types';

const tree: FsNode[] = [{ id: 'a', name: 'a.txt', type: 'documento', size: 10 }];

describe('fs storage', () => {
  beforeEach(() => localStorage.clear());

  it('returns null when nothing is stored', () => {
    expect(loadTree()).toBeNull();
  });

  it('round-trips a tree through localStorage', () => {
    saveTree(tree);
    expect(loadTree()).toEqual(tree);
  });

  it('returns null on corrupted data', () => {
    localStorage.setItem('miriamos.fs', '{not json');
    expect(loadTree()).toBeNull();
  });
});
