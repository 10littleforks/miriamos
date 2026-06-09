import type { Taste } from './questions';

export interface TasteProfile {
  musica: number;
  immagine: number;
  ordine: number;
  caos: number;
  dominant: Taste;
}

export function buildProfile(answers: Taste[]): TasteProfile {
  const counts: Record<Taste, number> = { musica: 0, immagine: 0, ordine: 0, caos: 0 };
  for (const a of answers) counts[a]++;

  let dominant: Taste = 'caos';
  let best = 0;
  (['musica', 'immagine', 'ordine', 'caos'] as Taste[]).forEach((t) => {
    if (counts[t] > best) { best = counts[t]; dominant = t; }
  });

  return { ...counts, dominant };
}
