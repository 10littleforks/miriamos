export type Taste = 'musica' | 'immagine' | 'ordine' | 'caos';

export interface Answer { label: string; taste: Taste; }
export interface Question { prompt: string; answers: Answer[]; }

export const QUESTIONS: Question[] = [
  {
    prompt: 'Comment ça va, le matin?',
    answers: [
      { label: 'Avec une chanson dans la tête', taste: 'musica' },
      { label: 'En regardant le ciel', taste: 'immagine' },
      { label: 'Liste des tâches déjà prête', taste: 'ordine' },
      { label: 'Je ne sais pas, le chaos', taste: 'caos' },
    ],
  },
  {
    prompt: 'Le bureau idéal?',
    answers: [
      { label: 'Une platine vinyle', taste: 'musica' },
      { label: 'Des affiches partout', taste: 'immagine' },
      { label: 'Vide et rangé', taste: 'ordine' },
      { label: 'Un joyeux bazar', taste: 'caos' },
    ],
  },
  {
    prompt: 'Le week-end?',
    answers: [
      { label: 'Concerts', taste: 'musica' },
      { label: 'Musées et photos', taste: 'immagine' },
      { label: 'Je planifie tout', taste: 'ordine' },
      { label: 'On verra bien', taste: 'caos' },
    ],
  },
  {
    prompt: 'Ton fichier préféré?',
    answers: [
      { label: 'Un .mp3', taste: 'musica' },
      { label: 'Une belle image', taste: 'immagine' },
      { label: 'Un tableur impeccable', taste: 'ordine' },
      { label: 'Le dossier "varie"', taste: 'caos' },
    ],
  },
];
