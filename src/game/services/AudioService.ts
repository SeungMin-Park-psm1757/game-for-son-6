type SoundId =
  | 'tap'
  | 'jump'
  | 'kick'
  | 'power-kick'
  | 'impact'
  | 'special'
  | 'dash'
  | 'wall'
  | 'goal'
  | 'celebrate'
  | 'whistle'
  | 'pause'
  | 'resume'
  | 'win'
  | 'lose';

class AudioService {
  private context: AudioContext | null = null;
  private soundEnabled = true;

  boot(soundEnabled: boolean): void {
    this.soundEnabled = soundEnabled;
  }

  setSoundEnabled(nextValue: boolean): void {
    this.soundEnabled = nextValue;
  }

  async unlock(): Promise<void> {
    const AudioContextCtor =
      typeof window !== 'undefined'
        ? window.AudioContext ||
          (window as Window & { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext ||
          null
        : null;

    if (!AudioContextCtor) {
      return;
    }

    if (!this.context) {
      this.context = new AudioContextCtor();
    }

    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  play(soundId: SoundId): void {
    if (!this.soundEnabled || !this.context) {
      return;
    }

    const time = this.context.currentTime;

    switch (soundId) {
      case 'tap':
        this.sequence([
          [660, 0.035, 'square', 0.032, time],
          [880, 0.045, 'triangle', 0.024, time + 0.02],
        ]);
        break;
      case 'jump':
        this.sweep(320, 520, 0.11, 'triangle', 0.036, time);
        break;
      case 'kick':
        this.sequence([
          [150, 0.045, 'square', 0.055, time],
          [210, 0.05, 'sawtooth', 0.03, time + 0.012],
        ]);
        break;
      case 'power-kick':
        this.sequence([
          [120, 0.06, 'square', 0.07, time],
          [240, 0.08, 'sawtooth', 0.045, time + 0.018],
          [420, 0.1, 'triangle', 0.025, time + 0.04],
        ]);
        break;
      case 'impact':
        this.sequence([
          [180, 0.03, 'square', 0.03, time],
          [110, 0.05, 'triangle', 0.024, time + 0.01],
        ]);
        break;
      case 'special':
        this.sequence([
          [410, 0.08, 'sawtooth', 0.03, time],
          [560, 0.08, 'sawtooth', 0.03, time + 0.04],
          [760, 0.12, 'triangle', 0.04, time + 0.09],
        ]);
        break;
      case 'dash':
        this.sweep(260, 880, 0.16, 'sawtooth', 0.04, time);
        break;
      case 'wall':
        this.sequence([
          [180, 0.08, 'square', 0.045, time],
          [120, 0.12, 'triangle', 0.03, time + 0.04],
        ]);
        break;
      case 'goal':
        this.sequence([
          [320, 0.12, 'triangle', 0.035, time],
          [480, 0.12, 'triangle', 0.038, time + 0.08],
          [660, 0.2, 'square', 0.05, time + 0.15],
        ]);
        break;
      case 'celebrate':
        this.sequence([
          [520, 0.06, 'triangle', 0.03, time],
          [700, 0.06, 'triangle', 0.03, time + 0.06],
          [860, 0.1, 'triangle', 0.036, time + 0.12],
        ]);
        break;
      case 'whistle':
        this.sequence([
          [980, 0.14, 'square', 0.04, time],
          [860, 0.1, 'square', 0.03, time + 0.1],
        ]);
        break;
      case 'pause':
        this.sequence([
          [420, 0.05, 'square', 0.026, time],
          [340, 0.08, 'square', 0.022, time + 0.04],
        ]);
        break;
      case 'resume':
        this.sequence([
          [360, 0.05, 'triangle', 0.026, time],
          [520, 0.08, 'triangle', 0.024, time + 0.04],
        ]);
        break;
      case 'win':
        this.sequence([
          [520, 0.08, 'triangle', 0.03, time],
          [660, 0.08, 'triangle', 0.03, time + 0.08],
          [860, 0.16, 'triangle', 0.04, time + 0.16],
        ]);
        break;
      case 'lose':
        this.sequence([
          [430, 0.1, 'sine', 0.03, time],
          [360, 0.12, 'sine', 0.03, time + 0.08],
          [280, 0.16, 'sine', 0.03, time + 0.16],
        ]);
        break;
    }
  }

  private sequence(
    notes: Array<[number, number, OscillatorType, number, number]>,
  ): void {
    for (const [frequency, duration, type, gainValue, when] of notes) {
      this.beep(frequency, duration, type, gainValue, when);
    }
  }

  private sweep(
    from: number,
    to: number,
    duration: number,
    type: OscillatorType,
    gainValue: number,
    when: number,
  ): void {
    if (!this.context) {
      return;
    }

    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(from, when);
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(to, 1),
      when + duration,
    );
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(gainValue, when + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start(when);
    oscillator.stop(when + duration + 0.02);
  }

  private beep(
    frequency: number,
    duration: number,
    type: OscillatorType,
    gainValue: number,
    when: number,
  ): void {
    if (!this.context) {
      return;
    }

    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, when);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(gainValue, when + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.start(when);
    oscillator.stop(when + duration + 0.02);
  }
}

export const audioService = new AudioService();
