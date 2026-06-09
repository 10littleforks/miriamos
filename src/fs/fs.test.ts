import { describe, it, expect } from 'vitest';
import { createFs } from './fs';
import type { FsNode } from './types';

const seed = (): FsNode[] => [
  { id: 'a', name: 'a.txt', type: 'documento', size: 10 },
  {
    id: 'mus', name: 'Musica', type: 'cartella', size: 0,
    children: [{ id: 'm1', name: 's1.mp3', type: 'musica', size: 5 }],
  },
];

describe('fs', () => {
  it('lists root nodes', () => {
    const fs = createFs(seed());
    expect(fs.list().map((n) => n.id)).toEqual(['a', 'mus']);
  });

  it('creates a node under root', () => {
    const fs = createFs(seed());
    fs.create({ id: 'b', name: 'b.png', type: 'immagine', size: 7 });
    expect(fs.list().map((n) => n.id)).toContain('b');
  });

  it('creates a node inside a folder', () => {
    const fs = createFs(seed());
    fs.create({ id: 'm2', name: 's2.mp3', type: 'musica', size: 3 }, 'mus');
    const folder = fs.list().find((n) => n.id === 'mus')!;
    expect(folder.children!.map((n) => n.id)).toEqual(['m1', 'm2']);
  });

  it('deletes a node anywhere in the tree', () => {
    const fs = createFs(seed());
    fs.remove('m1');
    const folder = fs.list().find((n) => n.id === 'mus')!;
    expect(folder.children).toEqual([]);
  });

  it('computes folder weight as sum of descendant sizes', () => {
    const fs = createFs(seed());
    fs.create({ id: 'm2', name: 's2.mp3', type: 'musica', size: 3 }, 'mus');
    expect(fs.weight('mus')).toBe(8);
  });

  it('emits change events on mutation', () => {
    const fs = createFs(seed());
    let calls = 0;
    fs.onChange(() => { calls++; });
    fs.create({ id: 'b', name: 'b.png', type: 'immagine', size: 7 });
    fs.remove('b');
    expect(calls).toBe(2);
  });
});
