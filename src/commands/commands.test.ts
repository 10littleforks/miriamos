import { describe, it, expect } from 'vitest';
import { parseCommand } from './commands';

describe('parseCommand', () => {
  it('recognizes power-on', () => {
    expect(parseCommand('bonjour')?.id).toBe('power-on');
    expect(parseCommand('  BONSOIR ')?.id).toBe('power-on');
  });

  it('recognizes shutdown', () => {
    expect(parseCommand('merci au revoir')?.id).toBe('power-off');
  });

  it('recognizes brightness', () => {
    expect(parseCommand('volumus maxima')?.id).toBe('brightness-up');
    expect(parseCommand('volumus minima')?.id).toBe('brightness-down');
  });

  it('recognizes open with an argument', () => {
    const r = parseCommand('alò mora Musica');
    expect(r?.id).toBe('open');
    expect(r?.arg).toBe('Musica');
  });

  it('returns unknown for unrecognized input', () => {
    expect(parseCommand('ciao bella')?.id).toBe('unknown');
  });

  it('returns null for empty input', () => {
    expect(parseCommand('   ')).toBeNull();
  });
});
