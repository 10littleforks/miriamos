import type { FsNode } from '../fs/types';
import type { TasteProfile } from '../quiz/profile';
import type { Taste } from '../quiz/questions';

export interface Personalization {
  accent: string;
  seedNodes: FsNode[];
}

const ACCENTS: Record<Taste, string> = {
  musica: '#ff5a3c',
  immagine: '#e85b9c',
  ordine: '#2a6fd6',
  caos: '#f2c200',
};

const SEEDS: Record<Taste, () => FsNode[]> = {
  musica: () => [
    { id: 'app-son', name: 'MiriamSon', type: 'codice', size: 40 },
    {
      id: 'dir-musica', name: 'Musica', type: 'cartella', size: 0,
      children: [
        { id: 'mus-1', name: 'aurore.mp3', type: 'musica', size: 8 },
        { id: 'mus-2', name: 'minuit.mp3', type: 'musica', size: 12 },
        { id: 'mus-3', name: 'soleil.mp3', type: 'musica', size: 6 },
      ],
    },
  ],
  immagine: () => [
    { id: 'app-pix', name: 'MiriamPix', type: 'codice', size: 35 },
    {
      id: 'dir-foto', name: 'Immagini', type: 'cartella', size: 0,
      children: [
        { id: 'img-1', name: 'paris.png', type: 'immagine', size: 20 },
        { id: 'img-2', name: 'mer.png', type: 'immagine', size: 14 },
      ],
    },
  ],
  ordine: () => [
    {
      id: 'dir-doc', name: 'Documenti', type: 'cartella', size: 0,
      children: [
        { id: 'doc-1', name: 'plan.txt', type: 'documento', size: 9 },
        { id: 'doc-2', name: 'budget.txt', type: 'documento', size: 11 },
        { id: 'doc-3', name: 'agenda.txt', type: 'documento', size: 7 },
      ],
    },
  ],
  caos: () => [
    {
      id: 'dir-varie', name: 'varie', type: 'cartella', size: 0,
      children: [
        { id: 'v-1', name: 'boh.mp3', type: 'musica', size: 5 },
        { id: 'v-2', name: 'screenshot.png', type: 'immagine', size: 9 },
        { id: 'v-3', name: 'note.txt', type: 'documento', size: 4 },
        { id: 'v-4', name: 'roba.zip', type: 'archivio', size: 22 },
      ],
    },
  ],
};

export function personalize(profile: TasteProfile): Personalization {
  const t = profile.dominant;
  return { accent: ACCENTS[t], seedNodes: SEEDS[t]() };
}
