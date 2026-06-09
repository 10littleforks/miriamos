export type Phase =
  | 'OFF' | 'BOOTING' | 'TEST' | 'PERSONALIZING' | 'DESKTOP' | 'SHUTTING_DOWN';

export type SessionEvent =
  | 'powerOn' | 'booted' | 'testDone' | 'personalized' | 'powerOff' | 'off';

const TRANSITIONS: Record<Phase, Partial<Record<SessionEvent, Phase>>> = {
  OFF: { powerOn: 'BOOTING' },
  BOOTING: { booted: 'TEST' },
  TEST: { testDone: 'PERSONALIZING' },
  PERSONALIZING: { personalized: 'DESKTOP' },
  DESKTOP: { powerOff: 'SHUTTING_DOWN' },
  SHUTTING_DOWN: { off: 'OFF' },
};

export interface Session {
  readonly phase: Phase;
  send(event: SessionEvent): void;
  subscribe(fn: (phase: Phase) => void): void;
}

export function createSession(): Session {
  let phase: Phase = 'OFF';
  const subs: Array<(p: Phase) => void> = [];
  return {
    get phase() { return phase; },
    send(event) {
      const next = TRANSITIONS[phase][event];
      if (next) {
        phase = next;
        subs.forEach((fn) => fn(phase));
      }
    },
    subscribe(fn) { subs.push(fn); },
  };
}
