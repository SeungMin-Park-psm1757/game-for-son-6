type SoundId =
  | 'tap'
  | 'jump'
  | 'kick'
  | 'goal'
  | 'special'
  | 'whistle'
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
          [620, 0.05, 'square', 0.035, time],
          [780, 0.04, 'square', 0.025, time + 0.03],
        ]);
        break;
      case 'jump':
        this.sequence([
          [380, 0.04, 'triangle', 0.035, time],
          [470, 0.08, 'triangle', 0.03, time + 0.02],
        ]);
        break;
      case 'kick':
        this.sequence([
          [160, 0.04, 'square', 0.05, time],
          [240, 0.06, 'sawtooth', 0.02, time + 0.015],
        ]);
        break;
      case 'goal':
        this.sequence([
          [320, 0.12, 'triangle', 0.035, time],
          [440, 0.12, 'triangle', 0.035, time + 0.08],
          [620, 0.18, 'square', 0.04, time + 0.15],
        ]);
        break;
      case 'special':
        this.sequence([
          [400, 0.08, 'sawtooth', 0.03, time],
          [560, 0.08, 'sawtooth', 0.03, time + 0.04],
          [760, 0.12, 'triangle', 0.035, time + 0.09],
        ]);
        break;
      case 'whistle':
        this.sequence([
          [980, 0.14, 'square', 0.04, time],
          [860, 0.1, 'square', 0.03, time + 0.1],
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

