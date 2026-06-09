import { describe, it, expect } from 'vitest';
import { buildProfile } from './profile';
import type { Taste } from './questions';

describe('buildProfile', () => {
  it('counts each taste from the answers', () => {
    const answers: Taste[] = ['musica', 'musica', 'ordine', 'caos'];
    const p = buildProfile(answers);
    expect(p.musica).toBe(2);
    expect(p.ordine).toBe(1);
    expect(p.caos).toBe(1);
    expect(p.immagine).toBe(0);
  });

  it('identifies the dominant taste', () => {
    expect(buildProfile(['musica', 'musica', 'immagine', 'ordine']).dominant)
      .toBe('musica');
  });

  it('handles empty answers with a default dominant', () => {
    expect(buildProfile([]).dominant).toBe('caos');
  });
});
