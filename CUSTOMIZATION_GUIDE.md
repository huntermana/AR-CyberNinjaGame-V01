# 🥷 Cyber Ninja: Firewall Slasher
# Asset Customization & Extension Manual (BGM & Graphics)

Welcome to the **Cyber Ninja: Firewall Slasher** Customization Guide. This manual details how to add, replace, and fine-tune game assets—including background music (BGM), sound effects (SFX), and graphic sprites (Bosses, UI, and Logo).

---

## 1. Quick In-Game Asset Manager & Sync Data

The easiest way to customize assets without modifying source code is the **In-Game Asset Manager**:
1. Launch the game in your browser.
2. Click **"🗂️ คลังไฟล์ & ซิงค์ข้อมูล"** (Asset Manager) on the top navigation bar or bottom dock.
3. Edit the asset paths to your desired custom files or URLs:
   - **Menu BGM**: e.g., `assets/audio/my_theme.mp3` or a web URL `https://.../cyber_beat.mp3`
   - **Mode 1-3 BGMs**: Team Score Attack, 1v1 Split Duel, Co-op Boss Raid
   - **Boss 1-5 Sprites**: Custom JPG/PNG/SVG monsters
   - **Game Logo**: Main title logo
4. Click **"🔄 ซิงค์ข้อมูลเข้าเกมทันที (SYNC DATA TO GAME)"**.
5. The game immediately updates its active assets and persists your configuration to `localStorage`.
6. Click **"↩️ คืนค่าเริ่มต้น (Reset Defaults)"** anytime to restore default assets.

---

## 2. Directory Structure & File Naming Conventions

To permanently replace assets on disk:

```
ICT Game 2/
├── assets/
│   ├── audio/
│   │   ├── bgm_menu.mp3        # Main Menu BGM (132 BPM recommended)
│   │   ├── bgm_mode1.mp3       # Team Score Attack BGM (136 BPM)
│   │   ├── bgm_mode2.mp3       # 1v1 Split Duel BGM (144 BPM)
│   │   ├── bgm_mode3.mp3       # Co-op Boss Raid BGM (138 BPM)
│   │   └── sfx_ultimate.mp3    # Ultimate Attack Boom SFX
│   │
│   └── images/
│       ├── cyber_ninja_logo.jpg        # Title logo banner
│       ├── boss_level1.jpg             # Level 1: Cyber Worm (Green)
│       ├── boss_level2.jpg             # Level 2: Cyber Demon (Red)
│       ├── boss_level3.jpg             # Level 3: Cyber Spider (Purple)
│       ├── boss_level4.jpg             # Level 4: Cyber Hydra (Cyan)
│       ├── boss_level5.jpg             # Level 5: Zero-Day Golem (Gold)
│       ├── tutorial_gesture_slash.jpg  # 1-Finger Slash illustration
│       └── tutorial_gesture_catch.jpg  # 5-Finger Open Palm Catch illustration
```

---

## 3. Audio Specifications & Fallback System

- **Format**: `.mp3` (recommended), `.ogg`, or `.wav`
- **Recommended Bitrate**: 128 kbps to 192 kbps, 44.1 kHz / 48 kHz stereo
- **Graceful Web Audio Fallback**:
  If any custom `.mp3` file is missing or blocked by CORS, the built-in **CyberAudioEngine** instantly activates the procedural Web Audio synthesizer:
  - Mode 0 (Menu): 132 BPM, 4-on-the-floor electro kick, snappy digital snare, 16th saw bass.
  - Mode 1 (Score Attack): 136 BPM, rolling bassline, punchy kicks, high-energy arcade arpeggios.
  - Mode 2 (1v1 Duel): 144 BPM, industrial double-kick, crushing snare, pitch-dive bass.
  - Mode 3 (Boss Raid): 138 BPM, cinematic kicks, metallic snare, sub-bass seismic rumble.

---

## 4. Boss Artwork Specifications

- **Recommended Aspect Ratio**: 1:1 square or 4:3 landscape (e.g., 800x800px up to 1200x1200px)
- **Format**: `.jpg`, `.png`, or `.webp`
- **Interactive Lightbox**: All images support click-to-zoom with mouse wheel and 2-finger pinch scaling.

---

## 5. Developer Source Code & Build Process

If you edit any JavaScript files in `js/`:
1. Re-bundle by running:
   ```bash
   node bundle.js
   ```
2. This creates the production-ready standalone distribution `js/game-bundle.js`.
