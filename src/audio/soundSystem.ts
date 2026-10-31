/**
 * Procedural Web Audio API sound generator for The Sultanate of Ayaan
 * 100% zero-404, zero external audio files.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.4, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Footstep sound on sandstone
   */
  public playFootstep(isRunning: boolean = false) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    const pitch = isRunning ? 95 + Math.random() * 20 : 80 + Math.random() * 15;
    osc.frequency.setValueAtTime(pitch, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.08);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, t);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  /**
   * Coin jingling for royal treasury changes
   */
  public playCoin() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const frequencies = [1200, 1580, 2400];
    frequencies.forEach((f, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f + (Math.random() * 60 - 30), t + idx * 0.04);

      gain.gain.setValueAtTime(0.12, t + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + idx * 0.04);
      osc.stop(t + idx * 0.04 + 0.18);
    });
  }

  /**
   * UI Click / decree seal sound
   */
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(220, t + 0.06);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.06);
  }

  /**
   * Royal Oud Pluck (Traditional middle eastern lute string note)
   */
  public playOudChord() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    // Hijaz maqam notes (D, Eb, F#, G, A)
    const notes = [293.66, 311.13, 369.99, 440.0];
    const t = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t + i * 0.09);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, t + i * 0.09);
      filter.frequency.exponentialRampToValueAtTime(250, t + i * 0.09 + 0.6);

      gain.gain.setValueAtTime(0.14, t + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.09 + 0.7);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + i * 0.09);
      osc.stop(t + i * 0.09 + 0.7);
    });
  }

  /**
   * Royal Fanfare for mission completed or grand decree
   */
  public playFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const chords = [
      { time: 0.0, freq: 392.0 }, // G4
      { time: 0.15, freq: 523.25 }, // C5
      { time: 0.3, freq: 659.25 }, // E5
      { time: 0.45, freq: 783.99 }, // G5
      { time: 0.7, freq: 1046.5 }, // C6
    ];

    const t = this.ctx.currentTime;
    chords.forEach((c) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(c.freq, t + c.time);

      gain.gain.setValueAtTime(0.18, t + c.time);
      gain.gain.exponentialRampToValueAtTime(0.001, t + c.time + (c.time === 0.7 ? 0.9 : 0.25));

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t + c.time);
      osc.stop(t + c.time + (c.time === 0.7 ? 0.9 : 0.25));
    });
  }
}

export const sound = new SoundSystem();
