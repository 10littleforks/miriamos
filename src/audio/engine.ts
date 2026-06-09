import type { FsNode } from '../fs/types';
import { sizeToFrequency, typeToTimbre } from './mapping';

export type SoundEvent =
  | 'boot' | 'create' | 'delete' | 'error' | 'loading' | 'opera' | 'shutdown';

export class AudioEngine {
  private ctx: AudioContext | null = null;

  /** Va chiamato dal primo gesto utente (requisito browser). */
  resume() {
    this.ctx ??= new AudioContext();
    if (this.ctx.state === 'suspended') void this.ctx.resume();
  }

  private get audio(): AudioContext {
    this.ctx ??= new AudioContext();
    return this.ctx;
  }

  private blip(freq: number, type: OscillatorType, dur = 0.18, gain = 0.12, when = 0) {
    const ctx = this.audio;
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur);
  }

  playTile(node: FsNode) {
    this.blip(sizeToFrequency(node.size), typeToTimbre(node.type));
  }

  playEvent(name: SoundEvent) {
    switch (name) {
      case 'boot':
        [330, 440, 660].forEach((f, i) => this.blip(f, 'triangle', 0.25, 0.1, i * 0.12));
        break;
      case 'create': this.blip(880, 'sine', 0.12, 0.1); break;
      case 'delete': this.blip(160, 'sawtooth', 0.22, 0.1); break;
      case 'error': this.blip(120, 'square', 0.3, 0.12); break;
      case 'loading':
        [440, 392].forEach((f, i) => this.blip(f, 'triangle', 0.2, 0.06, i * 0.2));
        break;
      case 'opera': this.playOpera(); break;
      case 'shutdown':
        [660, 440, 330, 220].forEach((f, i) => this.blip(f, 'sine', 0.3, 0.1, i * 0.18));
        break;
    }
  }

  /** "Fragnen ist mir Vater": motivo lirico melodrammatico sintetico. */
  private playOpera() {
    const melody = [392, 440, 523, 659, 587, 440, 349];
    melody.forEach((f, i) => this.blip(f, 'sawtooth', 0.45, 0.12, i * 0.4));
  }
}
