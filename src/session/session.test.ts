import { describe, it, expect } from 'vitest';
import { createSession } from './session';

describe('session state machine', () => {
  it('starts OFF', () => {
    expect(createSession().phase).toBe('OFF');
  });

  it('OFF + powerOn → BOOTING', () => {
    const s = createSession();
    s.send('powerOn');
    expect(s.phase).toBe('BOOTING');
  });

  it('full happy path to DESKTOP', () => {
    const s = createSession();
    s.send('powerOn');     // BOOTING
    s.send('booted');      // TEST
    s.send('testDone');    // PERSONALIZING
    s.send('personalized'); // DESKTOP
    expect(s.phase).toBe('DESKTOP');
  });

  it('DESKTOP + powerOff → SHUTTING_DOWN → OFF', () => {
    const s = createSession();
    s.send('powerOn'); s.send('booted'); s.send('testDone'); s.send('personalized');
    s.send('powerOff');
    expect(s.phase).toBe('SHUTTING_DOWN');
    s.send('off');
    expect(s.phase).toBe('OFF');
  });

  it('ignores invalid transitions', () => {
    const s = createSession();
    s.send('powerOff'); // non valido da OFF
    expect(s.phase).toBe('OFF');
  });

  it('notifies subscribers on phase change', () => {
    const s = createSession();
    const seen: string[] = [];
    s.subscribe((p) => seen.push(p));
    s.send('powerOn');
    expect(seen).toContain('BOOTING');
  });
});
