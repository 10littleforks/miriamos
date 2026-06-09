import type { FsNode } from '../fs/types';

export interface Rect { x: number; y: number; w: number; h: number; }
export interface TreemapTile { node: FsNode; rect: Rect; }

function nodeWeight(node: FsNode): number {
  if (node.children) return node.children.reduce((s, c) => s + nodeWeight(c), 0);
  return Math.max(node.size, 1);
}

/** Squarified treemap (Bruls, Huizing, van Wijk). Pure and deterministic. */
export function layout(nodes: FsNode[], rect: Rect): TreemapTile[] {
  if (nodes.length === 0) return [];

  const totalWeight = nodes.reduce((s, n) => s + nodeWeight(n), 0);
  if (totalWeight === 0) return [];
  const totalArea = rect.w * rect.h;
  const items = nodes.map((n) => ({
    node: n,
    area: (nodeWeight(n) / totalWeight) * totalArea,
  }));

  const tiles: TreemapTile[] = [];
  let free = { ...rect };
  let row: typeof items = [];

  const worst = (r: typeof items, side: number): number => {
    const sum = r.reduce((s, i) => s + i.area, 0);
    const max = Math.max(...r.map((i) => i.area));
    const min = Math.min(...r.map((i) => i.area));
    const s2 = side * side;
    return Math.max((s2 * max) / (sum * sum), (sum * sum) / (s2 * min));
  };

  const layoutRow = (r: typeof items) => {
    const sum = r.reduce((s, i) => s + i.area, 0);
    const horizontal = free.w >= free.h;
    if (horizontal) {
      const rowW = sum / free.h;
      let y = free.y;
      for (const i of r) {
        const h = i.area / rowW;
        tiles.push({ node: i.node, rect: { x: free.x, y, w: rowW, h } });
        y += h;
      }
      free = { x: free.x + rowW, y: free.y, w: free.w - rowW, h: free.h };
    } else {
      const rowH = sum / free.w;
      let x = free.x;
      for (const i of r) {
        const w = i.area / rowH;
        tiles.push({ node: i.node, rect: { x, y: free.y, w, h: rowH } });
        x += w;
      }
      free = { x: free.x, y: free.y + rowH, w: free.w, h: free.h - rowH };
    }
  };

  for (const item of items) {
    const side = Math.min(free.w, free.h);
    if (row.length === 0) { row.push(item); continue; }
    if (worst(row, side) >= worst([...row, item], side)) {
      row.push(item);
    } else {
      layoutRow(row);
      row = [item];
    }
  }
  if (row.length) layoutRow(row);

  return tiles;
}
