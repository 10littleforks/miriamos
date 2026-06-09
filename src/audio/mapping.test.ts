import { describe, it, expect } from 'vitest';
import { sizeToFrequency, typeToTimbre } from './mapping';

describe('audio mapping', () => {
  it('bigger size → lower frequency', () => {
    expect(sizeToFrequency(100)).toBeLessThan(sizeToFrequency(1));
  });

  it('frequency stays in an audible range', () => {
    for (const s of [0, 1, 50, 1000, 100000]) {
      const f = sizeToFrequency(s);
      expect(f).toBeGreaterThanOrEqual(110);
      expect(f).toBeLessThanOrEqual(1760);
    }
  });

  it('maps each type to an oscillator timbre', () => {
    expect(typeToTimbre('musica')).toBe('sine');
    expect(typeToTimbre('codice')).toBe('square');
    expect(typeToTimbre('documento')).toBe('triangle');
  });
});
