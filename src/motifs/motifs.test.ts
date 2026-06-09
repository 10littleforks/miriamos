import { describe, it, expect } from 'vitest';
import { motifFor } from './motifs';
import type { FsNode } from '../fs/types';

const node = (over: Partial<FsNode>): FsNode => ({
  id: 'x', name: 'x', type: 'musica', size: 10, ...over,
});

describe('motifs', () => {
  it('is deterministic for the same node', () => {
    const n = node({ name: 'song.mp3' });
    expect(motifFor(n)).toEqual(motifFor(n));
  });

  it('produces a CSS background string', () => {
    expect(motifFor(node({})).background).toMatch(/gradient|#/);
  });

  it('different names of the same type give different styles (variation)', () => {
    const a = motifFor(node({ name: 's1.mp3' }));
    const b = motifFor(node({ name: 's2.mp3' }));
    expect(a.background).not.toBe(b.background);
  });

  it('different types use different motif families', () => {
    const music = motifFor(node({ name: 'same', type: 'musica' }));
    const doc = motifFor(node({ name: 'same', type: 'documento' }));
    expect(music.family).toBe('onde');
    expect(doc.family).toBe('righe');
    expect(music.background).not.toBe(doc.background);
  });

  it('covers every file type without throwing', () => {
    const types: FsNode['type'][] = [
      'documento', 'musica', 'immagine', 'codice', 'video', 'archivio', 'cartella',
    ];
    for (const type of types) {
      expect(() => motifFor(node({ type }))).not.toThrow();
    }
  });
});
