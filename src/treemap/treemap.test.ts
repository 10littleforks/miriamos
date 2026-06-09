import { describe, it, expect } from 'vitest';
import { layout } from './treemap';
import type { FsNode } from '../fs/types';

const rect = { x: 0, y: 0, w: 100, h: 100 };

const nodes: FsNode[] = [
  { id: 'a', name: 'a', type: 'documento', size: 50 },
  { id: 'b', name: 'b', type: 'musica', size: 30 },
  { id: 'c', name: 'c', type: 'immagine', size: 20 },
];

describe('treemap layout', () => {
  it('returns one tile per node', () => {
    expect(layout(nodes, rect)).toHaveLength(3);
  });

  it('tiles cover the full area (sum of areas ≈ rect area)', () => {
    const tiles = layout(nodes, rect);
    const total = tiles.reduce((s, t) => s + t.rect.w * t.rect.h, 0);
    expect(total).toBeCloseTo(rect.w * rect.h, 1);
  });

  it('larger node gets larger area', () => {
    const tiles = layout(nodes, rect);
    const area = (id: string) => {
      const t = tiles.find((x) => x.node.id === id)!;
      return t.rect.w * t.rect.h;
    };
    expect(area('a')).toBeGreaterThan(area('b'));
    expect(area('b')).toBeGreaterThan(area('c'));
  });

  it('keeps all tiles inside the rect', () => {
    const tiles = layout(nodes, rect);
    for (const t of tiles) {
      expect(t.rect.x).toBeGreaterThanOrEqual(rect.x - 0.001);
      expect(t.rect.y).toBeGreaterThanOrEqual(rect.y - 0.001);
      expect(t.rect.x + t.rect.w).toBeLessThanOrEqual(rect.x + rect.w + 0.001);
      expect(t.rect.y + t.rect.h).toBeLessThanOrEqual(rect.y + rect.h + 0.001);
    }
  });

  it('is deterministic', () => {
    expect(layout(nodes, rect)).toEqual(layout(nodes, rect));
  });

  it('handles empty input', () => {
    expect(layout([], rect)).toEqual([]);
  });
});
