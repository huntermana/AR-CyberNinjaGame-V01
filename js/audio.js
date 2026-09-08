// Cyber Ninja: Firewall Slasher - Audio Synthesizer, BGM Generator & SFX Engine

export class CyberAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterVolume = 1.0;
    this.bgmVolume = 0.50; // Default 50% on startup
    this.sfxVolume = 0.50; // Default 50% on startup

    this.masterGainNode = null;
    this.bgmGainNode = null;
    this.sfxGainNode = null;

    // BGM state
    this.currentMode = null;
    this.bgmTimer = null;
    this.isBgmPlaying = false;
    this.bgmStep = 0;
    this.customBgmAudio = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master Gain
      this.masterGainNode = this.ctx.createGain();
      this.masterGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
      this.masterGainNode.connect(this.ctx.destination);

      // Dedicated BGM Gain (Default 50%)
      this.bgmGainNode = this.ctx.createGain();
      this.bgmGainNode.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
      this.bgmGainNode.connect(this.masterGainNode);

      // Dedicated SFX Gain (Default 50%)
      this.sfxGainNode = this.ctx.createGain();
      this.sfxGainNode.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGainNode.connect(this.masterGainNode);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setBgmVolume(vol) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    if (this.bgmGainNode && this.ctx) {
      this.bgmGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.bgmVolume, this.ctx.currentTime);
    }
    if (this.customBgmAudio) {
      this.customBgmAudio.volume = this.isMuted ? 0 : this.bgmVolume * 0.7;
    }
  }

  setSfxVolume(vol) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.sfxGainNode && this.ctx) {
      this.sfxGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.sfxVolume, this.ctx.currentTime);
    }
  }

  setMasterVolume(vol) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGainNode && this.ctx) {
      this.masterGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGainNode && this.ctx) {
      this.masterGainNode.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
    if (this.customBgmAudio) {
      this.customBgmAudio.muted = this.isMuted;
    }
    return this.isMuted;
  }

  // -------------------------------------------------------------
  // BGM Engine: Distinct Cyber Themes for Menu and Modes 1, 2, 3
  // -------------------------------------------------------------
  playMenuBGM() {
    this.playBGM(0);
  }

  playBGM(mode = 1) {
    this.init();
    this.stopBGM();
    this.currentMode = mode;
    this.isBgmPlaying = true;
    this.bgmStep = 0;

    // Check custom audio path from AssetManager or default
    const assetKey = mode === 0 ? 'bgm_menu' : `bgm_mode${mode}`;
    const customPath = (window.assetManager && window.assetManager.audioPaths && window.assetManager.audioPaths[assetKey])
      ? window.assetManager.audioPaths[assetKey]
      : `assets/audio/${mode === 0 ? 'bgm_menu.mp3' : `bgm_mode${mode}.mp3`}`;

    const testAudio = new Audio(customPath);
    testAudio.loop = true;
    testAudio.volume = this.isMuted ? 0 : this.bgmVolume;

    const playPromise = testAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.customBgmAudio = testAudio;
      }).catch(() => {
        // Fallback to enhanced procedural Web Audio synthesizer
        this.startProceduralBGM(mode);
      });
    } else {
      this.startProceduralBGM(mode);
    }
  }

  startProceduralBGM(mode) {
    if (!this.ctx) return;
    // Energetic BPM: Menu 132 BPM, Mode 1 136 BPM, Mode 2 144 BPM, Mode 3 138 BPM
    const tempo = mode === 0 ? 132 : (mode === 1 ? 136 : (mode === 2 ? 144 : 138));
    const stepInterval = (60 / tempo) / 2 * 1000; // Eighth notes in ms

    this.bgmTimer = setInterval(() => {
      if (!this.isBgmPlaying || this.isMuted) return;
      this.tickBgmStep(mode);
      this.bgmStep = (this.bgmStep + 1) % 32;
    }, stepInterval);
  }

  tickBgmStep(mode) {
    if (!this.ctx || this.ctx.state !== 'running') return;

    if (mode === 0) {
      // MODE 0: High-Octane Cyber Ninja Main Menu Battle Theme (D minor, 132 BPM)
      // Driving electronic bassline, punchy 4-on-the-floor electro kicks, sharp arpeggios, and cyber ninja stabs!
      const ninjaBass = [
        73.42, 73.42, 87.31, 73.42, 98.00, 73.42, 110.00, 87.31,
        73.42, 73.42, 87.31, 73.42, 116.54, 110.00, 98.00, 87.31
      ]; // D2, F2, G2, A2, Bb2...
      const ninjaLead = [
        293.66, 349.23, 440.00, 523.25, 587.33, 523.25, 440.00, 349.23,
        587.33, 698.46, 587.33, 523.25, 440.00, 523.25, 587.33, 698.46
      ]; // D4, F4, A4, C5, D5, F5...

      // 1. Driving Synth Bass: Fast rhythmic pulse on 16th-note feel
      const bassFreq = ninjaBass[this.bgmStep % ninjaBass.length];
      const isBassStep = (this.bgmStep % 2 === 0) || (this.bgmStep % 4 === 3);
      if (isBassStep) {
        this.playSynthNote(bassFreq, 0.12, 'sawtooth', 0.22, 520, true);
      }

      // 2. Punchy Electro Kick on quarter notes
      if (this.bgmStep % 4 === 0) {
        this.playKick(0.15, 0.28, true);
      }

      // 3. Cyber Snare / Digital Clap on 4 and 12 of every 16 steps
      if (this.bgmStep % 8 === 4) {
        this.playNoiseTick(0.10, 0.22, 2800, true);
        this.playSynthNote(220, 0.10, 'triangle', 0.14, 800, true);
      }

      // 4. Sizzling 16th-note Hi-Hat Groove
      if (this.bgmStep % 2 === 1) {
        const hatGain = (this.bgmStep % 4 === 3) ? 0.08 : 0.05;
        this.playNoiseTick(0.035, hatGain, 7500, true);
      }

      // 5. Heroic Cyber Ninja Katana Arpeggio & Melody
      if (this.bgmStep % 2 === 0) {
        const leadFreq = ninjaLead[(this.bgmStep / 2) % ninjaLead.length];
        this.playSynthNote(leadFreq, 0.16, 'square', 0.12, 2200, true);
      }

      // 6. Dramatic Cyber Stabs at phrase start (step 0 and 16)
      if (this.bgmStep === 0 || this.bgmStep === 16) {
        this.playSynthNote(146.83, 0.35, 'sawtooth', 0.18, 950, true); // D3
        this.playSynthNote(220.00, 0.35, 'sawtooth', 0.14, 950, true); // A3
        this.playSynthNote(349.23, 0.35, 'sawtooth', 0.14, 950, true); // F4
      }
    } else if (mode === 1) {
      // MODE 1: 136 BPM High-Energy Arcade Synthwave Rush (A minor pentatonic)
      // Driving 4-on-the-floor electro kick, snappy digital snare, rolling 16th bassline, hyper energetic melody!
      const bassNotes = [110.0, 110.0, 130.8, 146.8, 110.0, 110.0, 164.8, 196.0]; // A2, C3, D3, E3, G3
      const leadNotes = [440.0, 523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 880.0, 783.99];

      // 1. Driving Electro Kick on EVERY beat!
      if (this.bgmStep % 4 === 0) {
        this.playKick(0.15, 0.30, true);
      }

      // 2. Snappy Digital Snare on beats 4 and 12
      if (this.bgmStep % 8 === 4) {
        this.playNoiseTick(0.09, 0.24, 3200, true);
        this.playSynthNote(261.63, 0.08, 'triangle', 0.14, 700, true);
      }

      // 3. Sizzling offbeat Hi-Hat
      if (this.bgmStep % 2 === 1) {
        this.playNoiseTick(0.04, 0.07, 7000, true);
      }

      // 4. Rolling 16th-note Synthwave Bassline
      const isBass = (this.bgmStep % 2 === 0) || (this.bgmStep % 4 === 1);
      if (isBass) {
        const bassFreq = bassNotes[(Math.floor(this.bgmStep / 2)) % bassNotes.length];
        this.playSynthNote(bassFreq, 0.12, 'sawtooth', 0.24, 480, true);
      }

      // 5. Bright Energetic Synth Lead Arpeggio
      if (this.bgmStep % 2 === 0) {
        const leadFreq = leadNotes[this.bgmStep % leadNotes.length];
        this.playSynthNote(leadFreq, 0.16, 'square', 0.14, 2400, true);
      }

      // 6. Chord Stabs on phrase start
      if (this.bgmStep === 0 || this.bgmStep === 16) {
        this.playSynthNote(220.0, 0.32, 'sawtooth', 0.16, 1100, true); // A3
        this.playSynthNote(261.63, 0.32, 'sawtooth', 0.14, 1100, true); // C4
        this.playSynthNote(329.63, 0.32, 'sawtooth', 0.14, 1100, true); // E4
      }
    } else if (mode === 2) {
      // MODE 2: 144 BPM Aggressive Cyber Combat Darksynth Duel (D minor, intense punch)
      // Rapid double-kicks, crushing industrial snares, gritty distorted saw bass, combat siren stabs!
      const combatBass = [73.42, 73.42, 87.31, 73.42, 98.00, 73.42, 103.83, 110.0]; // D2, F2, G2, Ab2, A2
      const punchFreq = combatBass[this.bgmStep % combatBass.length];

      // 1. Industrial Double Kick Pattern
      if (this.bgmStep % 4 === 0 || this.bgmStep % 8 === 3 || this.bgmStep % 8 === 6) {
        this.playKick(0.14, 0.32, true);
      }

      // 2. Heavy Industrial Snare Punch on 4, 12, 20, 28
      if (this.bgmStep % 8 === 4) {
        this.playNoiseTick(0.12, 0.26, 2200, true);
        this.playSynthNote(196.0, 0.10, 'triangle', 0.18, 700, true);
      }

      // 3. Gritty Distorted Driving Saw Bass
      this.playSynthNote(punchFreq, 0.10, 'sawtooth', 0.26, 580, true);

      // 4. Combat Siren Laser Stabs on Counter-beats
      if (this.bgmStep % 4 === 2) {
        this.playSynthNote(587.33, 0.08, 'square', 0.14, 2600, true); // D5
        this.playSynthNote(698.46, 0.08, 'sawtooth', 0.12, 2600, true); // F5
      }

      // 5. Hi-Hat Sizzle
      if (this.bgmStep % 2 === 1) {
        this.playNoiseTick(0.035, 0.065, 8000, true);
      }
    } else if (mode === 3) {
      // MODE 3: 138 BPM Epic Cyber Kaiju Raid Anthem (Deep seismic sub-bass, thunderous kicks, heroic tension)
      const bossBass = [55.0, 55.0, 55.0, 65.41, 55.0, 55.0, 73.42, 82.41]; // A1, C2, D2, E2

      // 1. Thunderous Cinematic Kick Drum
      if (this.bgmStep % 4 === 0 || this.bgmStep % 16 === 14) {
        this.playKick(0.18, 0.34, true);
      }

      // 2. Crushing Metallic Snare on 4 and 12
      if (this.bgmStep % 8 === 4) {
        this.playNoiseTick(0.14, 0.28, 1800, true);
        this.playSynthNote(174.61, 0.12, 'triangle', 0.20, 600, true);
      }

      // 3. Seismic Sub-Bass Earthquake Rumble
      if (this.bgmStep % 2 === 0) {
        const freq = bossBass[(Math.floor(this.bgmStep / 4)) % bossBass.length];
        this.playSynthNote(freq, 0.32, 'triangle', 0.30, 260, true);
      }

      // 4. Dramatic Dark Boss Tension Chords
      if (this.bgmStep === 0 || this.bgmStep === 14 || this.bgmStep === 16 || this.bgmStep === 30) {
        this.playSynthNote(146.83, 0.32, 'sawtooth', 0.22, 1000, true); // D3
        this.playSynthNote(207.65, 0.32, 'sawtooth', 0.18, 1000, true); // G#3 (Tritone boss tension!)
        this.playSynthNote(293.66, 0.32, 'sawtooth', 0.16, 1000, true); // D4
      }

      // 5. Rising Laser Arpeggios (Building up hype for ultimate attacks!)
      if (this.bgmStep % 4 === 2) {
        this.playSynthNote(440.0 + (this.bgmStep * 15), 0.12, 'square', 0.12, 2200, true);
      }

      // 6. Hi-hat groove
      if (this.bgmStep % 2 === 1) {
        this.playNoiseTick(0.04, 0.07, 7200, true);
      }
    }
  }

  playSynthNote(freq, dur, type = 'sawtooth', gainVal = 0.08, filterFreq = 800, isBgm = false) {
    if (!this.ctx) return;
    const dest = isBgm ? this.bgmGainNode : this.sfxGainNode;
    if (!dest) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterFreq, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVal, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + dur);
  }

  playNoiseTick(dur, gainVal = 0.03, filterFreq = 5000, isBgm = false) {
    if (!this.ctx) return;
    const dest = isBgm ? this.bgmGainNode : this.sfxGainNode;
    if (!dest) return;
    const t = this.ctx.currentTime;
    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    if (bufferSize <= 0) return;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(filterFreq, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVal, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(t);
    noise.stop(t + dur);
  }

  playKick(dur = 0.18, gainVal = 0.12, isBgm = false) {
    if (!this.ctx) return;
    const dest = isBgm ? this.bgmGainNode : this.sfxGainNode;
    if (!dest) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + dur);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVal, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(t);
    osc.stop(t + dur);
  }

  pauseBGM() {
    this.isBgmPlaying = false;
    if (this.customBgmAudio) {
      this.customBgmAudio.pause();
    }
  }

  resumeBGM() {
    if (this.currentMode !== null) {
      this.isBgmPlaying = true;
      if (this.customBgmAudio) {
        this.customBgmAudio.play().catch(() => {});
      }
    }
  }

  stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    if (this.customBgmAudio) {
      this.customBgmAudio.pause();
      this.customBgmAudio.currentTime = 0;
      this.customBgmAudio = null;
    }
  }

  // -------------------------------------------------------------
  // Sound Effects Engine (Connected to sfxGainNode)
  // -------------------------------------------------------------

  // 1. Cyber Blade Laser Slash Swoosh with Sharp Edge & Digital Glitch
  playSlash(speedRatio = 1.0) {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;

    // A. High-speed metallic whoosh (Bandpass noise sweep)
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.11);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200 * speedRatio, t);
    filter.frequency.exponentialRampToValueAtTime(4200 * speedRatio, t + 0.05);
    filter.frequency.exponentialRampToValueAtTime(900, t + 0.11);
    filter.Q.setValueAtTime(6, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.35, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.sfxGainNode);
    noise.start(t);
    noise.stop(t + 0.11);

    // B. Razor-sharp Katana Laser Ring ("SHING!" with rapid pitch dive)
    const bladeOsc = this.ctx.createOscillator();
    bladeOsc.type = 'sawtooth';
    bladeOsc.frequency.setValueAtTime(1600 * speedRatio, t);
    bladeOsc.frequency.exponentialRampToValueAtTime(180, t + 0.09);

    const bladeFilter = this.ctx.createBiquadFilter();
    bladeFilter.type = 'bandpass';
    bladeFilter.frequency.setValueAtTime(2200, t);
    bladeFilter.Q.setValueAtTime(8, t);

    const bladeGain = this.ctx.createGain();
    bladeGain.gain.setValueAtTime(0.3, t);
    bladeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    bladeOsc.connect(bladeFilter);
    bladeFilter.connect(bladeGain);
    bladeGain.connect(this.sfxGainNode);
    bladeOsc.start(t);
    bladeOsc.stop(t + 0.09);

    // C. Digital Glitch Staccato Slice (Crisp crunchy digital byte shred)
    const glitchFreqs = [2800, 1950, 3600];
    glitchFreqs.forEach((freq, idx) => {
      const gOsc = this.ctx.createOscillator();
      gOsc.type = 'square';
      gOsc.frequency.setValueAtTime(freq, t + idx * 0.018);

      const gGain = this.ctx.createGain();
      gGain.gain.setValueAtTime(0.14, t + idx * 0.018);
      gGain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.018 + 0.022);

      gOsc.connect(gGain);
      gGain.connect(this.sfxGainNode);
      gOsc.start(t + idx * 0.018);
      gOsc.stop(t + idx * 0.018 + 0.025);
    });
  }

  // 2. Malware Hit Explosion
  playHit() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.18);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

    const zap = this.ctx.createOscillator();
    zap.type = 'square';
    zap.frequency.setValueAtTime(1200, t);
    zap.frequency.exponentialRampToValueAtTime(200, t + 0.08);

    const zapGain = this.ctx.createGain();
    zapGain.gain.setValueAtTime(0.18, t);
    zapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    zap.connect(zapGain);
    zapGain.connect(this.sfxGainNode);

    osc.start(t);
    zap.start(t);
    osc.stop(t + 0.2);
    zap.stop(t + 0.09);
  }

  // 3. Safe Packet Catch Chime
  playCatch() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;

    const freqs = [1046.50, 1318.51, 1567.98];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.035);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.20, t + idx * 0.035);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.035 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(t + idx * 0.035);
      osc.stop(t + idx * 0.035 + 0.35);
    });
  }

  // 4. Glitch / Wrong Penalty Buzzer
  playPenalty() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, t);
    osc.frequency.setValueAtTime(100, t + 0.1);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.28);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(t);
    osc.stop(t + 0.28);
  }

  // 5. Countdown Electronic Beep
  playCountdown(isFinal = false) {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = isFinal ? 'square' : 'sine';
    osc.frequency.setValueAtTime(isFinal ? 880 : 440, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.30, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + (isFinal ? 0.45 : 0.18));

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start(t);
    osc.stop(t + (isFinal ? 0.45 : 0.18));
  }

  // 6. Freeze Frame / Sub-Bass Rumble
  playFreeze() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;

    const sub = this.ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(80, t);
    sub.frequency.exponentialRampToValueAtTime(25, t + 0.6);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.45, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    const high = this.ctx.createOscillator();
    high.type = 'triangle';
    high.frequency.setValueAtTime(2093, t);

    const highGain = this.ctx.createGain();
    highGain.gain.setValueAtTime(0.2, t);
    highGain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    sub.connect(subGain);
    subGain.connect(this.sfxGainNode);
    high.connect(highGain);
    highGain.connect(this.sfxGainNode);

    sub.start(t);
    high.start(t);
    sub.stop(t + 0.6);
    high.stop(t + 0.7);
  }

  // 7. Whistle / Runner Switch Double-Beep
  playWhistle() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;

    [0, 0.12].forEach(offset => {
      const osc = this.ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1760, t + offset);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.22, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(t + offset);
      osc.stop(t + offset + 0.08);
    });
  }

  // 8. Cyber Victory Fanfare
  playVictory() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.1);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, t + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.1 + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(t + idx * 0.1);
      osc.stop(t + idx * 0.1 + 0.4);
    });
  }

  // 9. MASSIVE ULTIMATE ATTACK BLAST (Rising Laser Beam + Colossal Seismic Detonation)
  playUltimateBlast() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;

    // A. High-energy rising laser cannon charging whine (Detuned dual oscillators)
    [0, 8].forEach(detune => {
      const chargeOsc = this.ctx.createOscillator();
      chargeOsc.type = 'sawtooth';
      chargeOsc.frequency.setValueAtTime(320 + detune, t);
      chargeOsc.frequency.exponentialRampToValueAtTime(4200 + detune, t + 0.35);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, t);
      filter.frequency.exponentialRampToValueAtTime(4500, t + 0.35);
      filter.Q.setValueAtTime(5, t);

      const chargeGain = this.ctx.createGain();
      chargeGain.gain.setValueAtTime(0.35, t);
      chargeGain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

      chargeOsc.connect(filter);
      filter.connect(chargeGain);
      chargeGain.connect(this.sfxGainNode);
      chargeOsc.start(t);
      chargeOsc.stop(t + 0.35);
    });

    // B. Beam Release: Crackling plasma noise burst
    const noiseLen = Math.floor(this.ctx.sampleRate * 0.4);
    const noiseBuf = this.ctx.createBuffer(1, noiseLen, this.ctx.sampleRate);
    const nData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) nData[i] = Math.random() * 2 - 1;

    const noiseSrc = this.ctx.createBufferSource();
    noiseSrc.buffer = noiseBuf;

    const nFilter = this.ctx.createBiquadFilter();
    nFilter.type = 'highpass';
    nFilter.frequency.setValueAtTime(1500, t + 0.25);
    nFilter.frequency.exponentialRampToValueAtTime(200, t + 0.65);

    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.5, t + 0.25);
    nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

    noiseSrc.connect(nFilter);
    nFilter.connect(nGain);
    nGain.connect(this.sfxGainNode);
    noiseSrc.start(t + 0.25);
    noiseSrc.stop(t + 0.65);

    // C. Colossal Seismic Detonation Shockwave (Earthquake sub-bass drop)
    const boomOsc = this.ctx.createOscillator();
    boomOsc.type = 'triangle';
    boomOsc.frequency.setValueAtTime(240, t + 0.3);
    boomOsc.frequency.exponentialRampToValueAtTime(24, t + 1.4);

    const boomGain = this.ctx.createGain();
    boomGain.gain.setValueAtTime(0.85, t + 0.3);
    boomGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.45);

    boomOsc.connect(boomGain);
    boomGain.connect(this.sfxGainNode);
    boomOsc.start(t + 0.3);
    boomOsc.stop(t + 1.45);

    // D. Heavy punch distortion kick
    const kickOsc = this.ctx.createOscillator();
    kickOsc.type = 'sine';
    kickOsc.frequency.setValueAtTime(180, t + 0.32);
    kickOsc.frequency.exponentialRampToValueAtTime(35, t + 0.6);

    const kickGain = this.ctx.createGain();
    kickGain.gain.setValueAtTime(0.7, t + 0.32);
    kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    kickOsc.connect(kickGain);
    kickGain.connect(this.sfxGainNode);
    kickOsc.start(t + 0.32);
    kickOsc.stop(t + 0.6);
  }
}

export const audio = new CyberAudioEngine();
