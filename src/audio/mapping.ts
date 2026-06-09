import type { FileType } from '../fs/types';

/** File grossi = note gravi, piccoli = acute. Range A2..A6. */
export function sizeToFrequency(size: number): number {
  const clamped = Math.min(Math.max(size, 1), 100000);
  const t = Math.log10(clamped) / Math.log10(100000); // 0..1
  const minF = 110; // A2
  const maxF = 1760; // A6
  return Math.round(maxF - t * (maxF - minF));
}

export function typeToTimbre(type: FileType): OscillatorType {
  switch (type) {
    case 'musica': return 'sine';
    case 'codice': return 'square';
    case 'documento': return 'triangle';
    case 'immagine': return 'sine';
    case 'video': return 'sawtooth';
    case 'archivio': return 'square';
    case 'cartella': return 'triangle';
  }
}
