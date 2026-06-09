import type { FileType, FsNode } from '../fs/types';
import { hashSeed, mulberry32 } from './seed';

export interface MotifStyle {
  family: string;
  background: string;
}

interface Family {
  name: string;
  /** hue base + ampiezza della gamma (gradi HSL) */
  hue: [number, number];
  build: (rng: () => number, hue: number) => string;
}

const px = (rng: () => number, min: number, max: number) =>
  Math.round(min + rng() * (max - min));

const FAMILIES: Record<FileType, Family> = {
  documento: {
    name: 'righe',
    hue: [215, 25],
    build: (rng, hue) => {
      const gap = px(rng, 5, 9);
      return `repeating-linear-gradient(0deg, hsl(${hue} 60% 28%) 0 2px, #f2ece1 2px ${gap}px)`;
    },
  },
  musica: {
    name: 'onde',
    hue: [12, 40],
    build: (rng, hue) => {
      const step = px(rng, 6, 14);
      const cx = px(rng, 30, 70);
      const cy = px(rng, 30, 70);
      return `repeating-radial-gradient(circle at ${cx}% ${cy}%, hsl(${hue} 90% 60%) 0 ${step / 2}px, hsl(${hue} 80% 85%) ${step / 2}px ${step}px)`;
    },
  },
  immagine: {
    name: 'campi',
    hue: [0, 360],
    build: (rng, hue) =>
      `conic-gradient(from ${px(rng, 0, 360)}deg, hsl(${hue} 80% 55%), hsl(${(hue + 90) % 360} 80% 55%), hsl(${(hue + 200) % 360} 80% 55%), hsl(${hue} 80% 55%))`,
  },
  codice: {
    name: 'matrice',
    hue: [160, 30],
    build: (rng, hue) => {
      const size = px(rng, 10, 16);
      return `radial-gradient(hsl(${hue} 80% 70%) 2px, transparent 3px) 0 0 / ${size}px ${size}px, hsl(${hue} 60% 12%)`;
    },
  },
  video: {
    name: 'fotogrammi',
    hue: [0, 0],
    build: (rng) => {
      const band = px(rng, 8, 14);
      return `repeating-linear-gradient(0deg, #1a1a1a 0 ${band}px, #cfcfcf ${band}px ${band + 4}px)`;
    },
  },
  archivio: {
    name: 'strati',
    hue: [48, 6],
    build: (rng, hue) => {
      const gap = px(rng, 8, 16);
      return `repeating-linear-gradient(135deg, hsl(${hue} 95% 55%) 0 ${gap / 2}px, #1a1a1a ${gap / 2}px ${gap}px)`;
    },
  },
  cartella: {
    name: 'cornice',
    hue: [0, 0],
    build: () => '#f2ece1',
  },
};

export function motifFor(node: FsNode): MotifStyle {
  const family = FAMILIES[node.type];
  const rng = mulberry32(hashSeed(node.name + ':' + node.size));
  const hue = (family.hue[0] + rng() * family.hue[1]) % 360;
  return { family: family.name, background: family.build(rng, hue) };
}
