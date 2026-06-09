import { describe, it, expect } from 'vitest';
import { hashSeed, mulberry32 } from './seed';

describe('seed', () => {
  it('hashSeed is deterministic', () => {
    expect(hashSeed('a.mp3')).toBe(hashSeed('a.mp3'));
  });

  it('different strings give different seeds', () => {
    expect(hashSeed('a.mp3')).not.toBe(hashSeed('b.mp3'));
  });

  it('mulberry32 yields numbers in [0,1)', () => {
    const rng = mulberry32(123);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('mulberry32 is reproducible for same seed', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
});
