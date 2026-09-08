// Cyber Ninja: Firewall Slasher - Intelligent Asset Manager & Graceful Fallback System

export class AssetManager {
  constructor() {
    this.images = new Map();
    this.audioElements = new Map();

    this.defaultImageFallbacks = {
      'tutorial_slash': 'assets/images/tutorial_gesture_slash.jpg',
      'tutorial_catch': 'assets/images/tutorial_gesture_catch.jpg',
      'boss_monster': 'assets/images/cyber_boss_monster.jpg',
      'boss_level1': 'assets/images/boss_level1.jpg',
      'boss_level2': 'assets/images/boss_level2.jpg',
      'boss_level3': 'assets/images/boss_level3.jpg',
      'boss_level4': 'assets/images/boss_level4.jpg',
      'boss_level5': 'assets/images/boss_level5.jpg',
      'ultimate_icon': 'assets/images/ultimate_attack_icon.svg',
      'logo': 'assets/images/cyber_ninja_logo.jpg'
    };

    this.defaultAudioPaths = {
      'bgm_menu': 'assets/audio/bgm_menu.mp3',
      'bgm_mode1': 'assets/audio/bgm_mode1.mp3',
      'bgm_mode2': 'assets/audio/bgm_mode2.mp3',
      'bgm_mode3': 'assets/audio/bgm_mode3.mp3',
      'sfx_ultimate': 'assets/audio/sfx_ultimate.mp3'
    };

    this.imageFallbacks = { ...this.defaultImageFallbacks };
    this.audioPaths = { ...this.defaultAudioPaths };

    if (typeof window !== 'undefined') {
      window.assetManager = this;
    }

    this.loadSavedConfig();
    this.preloadAll();
  }

  loadSavedConfig() {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('cyber_ninja_assets');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.audio) {
            this.audioPaths = { ...this.audioPaths, ...parsed.audio };
          }
          if (parsed.images) {
            this.imageFallbacks = { ...this.imageFallbacks, ...parsed.images };
          }
          console.log('[AssetManager] Loaded custom user asset configuration from localStorage.');
        }
      }
    } catch (e) {
      console.warn('[AssetManager] Could not load localStorage configuration:', e);
    }
  }

  syncCustomData(customData) {
    if (!customData) return false;
    try {
      if (customData.audio) {
        for (const [k, v] of Object.entries(customData.audio)) {
          if (v && typeof v === 'string' && v.trim()) {
            this.audioPaths[k] = v.trim();
          }
        }
      }

      if (customData.images) {
        for (const [k, v] of Object.entries(customData.images)) {
          if (v && typeof v === 'string' && v.trim()) {
            const trimmed = v.trim();
            this.imageFallbacks[k] = trimmed;
            // Hot reload image
            const img = new Image();
            img.src = trimmed;
            img.onload = () => {
              this.images.set(k, img);
              console.log(`[AssetManager] Dynamically updated image: '${k}' -> '${trimmed}'`);
            };
          }
        }
      }

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('cyber_ninja_assets', JSON.stringify({
          audio: this.audioPaths,
          images: this.imageFallbacks
        }));
      }
      return true;
    } catch (e) {
      console.error('[AssetManager] syncCustomData error:', e);
      return false;
    }
  }

  resetDefaults() {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('cyber_ninja_assets');
      }
      this.imageFallbacks = { ...this.defaultImageFallbacks };
      this.audioPaths = { ...this.defaultAudioPaths };
      this.preloadAll();
      console.log('[AssetManager] Assets reset to default paths.');
      return true;
    } catch (e) {
      console.error('[AssetManager] resetDefaults error:', e);
      return false;
    }
  }

  preloadAll() {
    // Preload Images
    for (const [key, path] of Object.entries(this.imageFallbacks)) {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        this.images.set(key, img);
      };
      img.onerror = () => {
        console.warn(`[AssetManager] Notice: Image '${key}' at '${path}' not found, utilizing backup renderer.`);
      };
    }

    // Attempt preload of optional custom audio files
    for (const [key, path] of Object.entries(this.audioPaths)) {
      const audio = new Audio();
      audio.src = path;
      audio.preload = 'none'; // Don't block
      this.audioElements.set(key, audio);
    }
  }

  getImage(key) {
    return this.images.get(key) || null;
  }

  getAudio(key) {
    return this.audioElements.get(key) || null;
  }
}

export const assetManager = new AssetManager();

