import type { FsNode } from './types';

type Listener = () => void;

export interface Fs {
  list(parentId?: string): FsNode[];
  create(node: FsNode, parentId?: string): void;
  remove(id: string): void;
  weight(id: string): number;
  onChange(fn: Listener): void;
  snapshot(): FsNode[];
}

function findNode(nodes: FsNode[], id: string): FsNode | undefined {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNode(n.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

function removeNode(nodes: FsNode[], id: string): boolean {
  const i = nodes.findIndex((n) => n.id === id);
  if (i >= 0) { nodes.splice(i, 1); return true; }
  for (const n of nodes) {
    if (n.children && removeNode(n.children, id)) return true;
  }
  return false;
}

function nodeWeight(node: FsNode): number {
  if (node.children) return node.children.reduce((s, c) => s + nodeWeight(c), 0);
  return node.size;
}

export function createFs(root: FsNode[]): Fs {
  const tree = root;
  const listeners: Listener[] = [];
  const emit = () => listeners.forEach((l) => l());

  return {
    list(parentId) {
      if (!parentId) return tree;
      const parent = findNode(tree, parentId);
      return parent?.children ?? [];
    },
    create(node, parentId) {
      if (parentId) {
        const parent = findNode(tree, parentId);
        if (parent) {
          parent.children ??= [];
          parent.children.push(node);
        }
      } else {
        tree.push(node);
      }
      emit();
    },
    remove(id) {
      if (removeNode(tree, id)) emit();
    },
    weight(id) {
      const n = findNode(tree, id);
      return n ? nodeWeight(n) : 0;
    },
    onChange(fn) { listeners.push(fn); },
    snapshot() { return tree; },
  };
}
