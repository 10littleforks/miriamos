import { describe, it, expect } from 'vitest';
import { personalize } from './personalize';
import type { TasteProfile } from '../quiz/profile';

const profile = (dominant: TasteProfile['dominant']): TasteProfile => ({
  musica: 0, immagine: 0, ordine: 0, caos: 0, dominant,
});

describe('personalize', () => {
  it('is deterministic for the same profile', () => {
    expect(personalize(profile('musica'))).toEqual(personalize(profile('musica')));
  });

  it('music lovers get a music app and a music folder', () => {
    const p = personalize(profile('musica'));
    expect(p.seedNodes.some((n) => n.name === 'MiriamSon')).toBe(true);
    expect(p.seedNodes.some((n) => n.type === 'cartella' && n.children?.some((c) => c.type === 'musica'))).toBe(true);
  });

  it('image lovers get image content', () => {
    const p = personalize(profile('immagine'));
    expect(p.seedNodes.some((n) => n.type === 'immagine' || n.children?.some((c) => c.type === 'immagine'))).toBe(true);
  });

  it('assigns an accent color per dominant taste', () => {
    expect(personalize(profile('musica')).accent).not.toBe(personalize(profile('ordine')).accent);
  });
});
