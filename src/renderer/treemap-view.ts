import type { FsNode } from '../fs/types';
import { layout, type Rect } from '../treemap/treemap';
import { motifFor } from '../motifs/motifs';
import type { AudioEngine } from '../audio/engine';

export interface TreemapViewOptions {
  audio: AudioEngine;
  onSelect?: (node: FsNode) => void;
}

export class TreemapView {
  readonly el: HTMLElement;
  private nodes: FsNode[] = [];
  private tilesById = new Map<string, HTMLElement>();

  constructor(private opts: TreemapViewOptions) {
    this.el = document.createElement('div');
    this.el.className = 'treemap';
  }

  /** Ridisegna l'intero quadro. I tasselli esistenti si spostano (transizione CSS). */
  render(nodes: FsNode[]) {
    this.nodes = nodes;
    const rect: Rect = { x: 0, y: 0, w: 100, h: 100 };
    const seen = new Set<string>();
    this.renderLevel(this.nodes, rect, seen);
    // rimuovi i tasselli non più presenti
    for (const [id, el] of this.tilesById) {
      if (!seen.has(id)) { el.remove(); this.tilesById.delete(id); }
    }
  }

  private renderLevel(nodes: FsNode[], rect: Rect, seen: Set<string>) {
    for (const tile of layout(nodes, rect)) {
      seen.add(tile.node.id);
      const el = this.ensureTile(tile.node);
      const r = tile.rect;
      el.style.left = `${r.x}%`;
      el.style.top = `${r.y}%`;
      el.style.width = `${r.w}%`;
      el.style.height = `${r.h}%`;
      if (tile.node.children) {
        el.classList.add('folder');
        el.style.background = '#f2ece1';
        // i figli sono renderizzati nello stesso piano assoluto, ma confinati
        const inset = { x: r.x + r.w * 0.04, y: r.y + r.h * 0.04, w: r.w * 0.92, h: r.h * 0.92 };
        this.renderLevel(tile.node.children, inset, seen);
      } else {
        el.style.background = motifFor(tile.node).background;
      }
    }
  }

  private ensureTile(node: FsNode): HTMLElement {
    let el = this.tilesById.get(node.id);
    if (!el) {
      el = document.createElement('div');
      el.className = 'tile';
      el.addEventListener('mouseenter', () => this.opts.audio.playTile(node));
      el.addEventListener('click', () => {
        this.el.querySelectorAll('.tile.selected').forEach((t) => t.classList.remove('selected'));
        el!.classList.add('selected');
        this.opts.audio.playTile(node);
        this.opts.onSelect?.(node);
      });
      this.el.appendChild(el);
      this.tilesById.set(node.id, el);
    }
    return el;
  }
}
