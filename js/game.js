// Cyber Ninja: Firewall Slasher - Master Game Coordinator & AR Canvas Engine

import { CONFIG } from './config.js';
import { i18n } from './i18n.js';
import { audio } from './audio.js';
import { assetManager } from './asset-manager.js';
import { MediaPipeAdapter } from './tracking/mediapipe-adapter.js';
import { GestureDetector } from './tracking/gesture-detector.js';
import { BladeTrail } from './tracking/blade-trail.js';
import { ParticleSystem } from './entities/particle-system.js';
import { ScoreAttackMode } from './modes/score-attack.js';
import { SplitDuelMode } from './modes/split-duel.js';
import { FirewallRelayMode } from './modes/firewall-relay.js';
import { SafePacket } from './entities/safe-packet.js';
import { Malware } from './entities/malware.js';
import { leaderboard } from './ui/leaderboard.js';
import { tvBroadcast } from './ui/tv-broadcast.js';

export class CyberNinjaGame {
  constructor() {
    window.SafePacket = SafePacket;
    window.Malware = Malware;

    this.video = document.getElementById('cameraFeed');
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');

    // Resolution sizing
    this.canvas.width = CONFIG.CANVAS_WIDTH;
    this.canvas.height = CONFIG.CANVAS_HEIGHT;

    // Tracking & Gestures
    this.gestureDetector = new GestureDetector();
    this.mediaPipe = new MediaPipeAdapter(this.video, this.canvas, (hands) => this.onHandResults(hands));
    
    // Blade Trails (P1 Cyan, P2 Magenta)
    this.trailP1 = new BladeTrail('cyan');
    this.trailP2 = new BladeTrail('magenta');

    // VFX
    this.particles = new ParticleSystem();

    // Game Modes
    this.mode1 = new ScoreAttackMode(this);
    this.mode2 = new SplitDuelMode(this);
    this.mode3 = new FirewallRelayMode(this);

    // Current State: 'MENU', 'PLAYING_MODE1', 'PLAYING_MODE2', 'PLAYING_MODE3'
    this.currentState = 'MENU';
    this.activeMode = null;
    this.isPaused = false;

    this.lastResultData = null;
    this.lastDuelResult = null;
    this.lastBossResult = null;

    this.detectedHands = [];
    this.lastHandTimestamp = performance.now();
    this.lastFrameTime = performance.now();

    // Hand Exit Watchdog: false = OFF (keep cursor for 2 seconds - recommended for edge tracking), true = ON (quick 200ms clear)
    this.handExitWatchdogEnabled = false;
    try {
      const saved = localStorage.getItem('cyber_ninja_watchdog');
      if (saved !== null) {
        this.handExitWatchdogEnabled = JSON.parse(saved);
      }
    } catch (e) {}

    // Default volume at 50% on every game launch
    audio.setBgmVolume(0.50);
    audio.setSfxVolume(0.50);

    this.initUI();
    this.startRenderLoop();

    // Attempt to start Menu BGM immediately (in case autoplay is permitted)
    audio.playMenuBGM();

    // Unlock Web Audio on first user interaction anywhere and play Menu BGM if in menu
    const unlockAudio = () => {
      audio.init();
      if (this.currentState === 'MENU') {
        audio.playMenuBGM();
      }
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
  }

  initUI() {
    // Top Bar & Settings Modal Buttons
    document.getElementById('btnLangToggle')?.addEventListener('click', () => {
      audio.init();
      audio.playCountdown(false);
      i18n.toggle();
      this.updateAllTexts();
    });

    document.getElementById('btnTvToggle')?.addEventListener('click', () => {
      audio.init();
      audio.playCountdown(false);
      const active = tvBroadcast.toggle();
      document.getElementById('btnTvToggle').classList.toggle('active', active);
    });

    document.getElementById('btnFullscreen')?.addEventListener('click', () => {
      audio.init();
      tvBroadcast.toggleFullscreen();
    });

    document.getElementById('btnSimToggle')?.addEventListener('click', () => {
      audio.init();
      const isSim = this.mediaPipe.enableSimulator(!this.mediaPipe.isSimulated);
      document.getElementById('btnSimToggle').classList.toggle('active', isSim);
      if (isSim) {
        this.mediaPipe.updateStatus('🖱️ สลับเป็นโหมดเมาส์/สัมผัส (Mouse Simulator Active)', '#00ff66');
      } else {
        this.mediaPipe.updateStatus('📷 สลับเป็นโหมดกล้อง AR (Camera Mode Active)', '#00e5ff');
      }
    });

    const btnFistToggle = document.getElementById('btnFistToggle');
    btnFistToggle?.addEventListener('click', () => {
      audio.init();
      audio.playCountdown(false);
      const isDiscard = this.mediaPipe.toggleFistDiscard();
      btnFistToggle.classList.toggle('active', isDiscard);
      btnFistToggle.textContent = isDiscard ? '✊ กำหมัด=พักมือ: เปิด' : '✊ กำหมัด=พักมือ: ปิด';
      this.mediaPipe.updateStatus(
        isDiscard ? '✊ เปิดใช้งาน: กำหมัด = พักมือ (Fist Discard ON)' : '✋ ปิดใช้งาน: แทร็กทุกท่ามือ (Fist Discard OFF)',
        isDiscard ? '#00ffcc' : '#ff9900'
      );
    });

    // Hand Exit Watchdog UI controller
    const btnWatchdogToggle = document.getElementById('btnWatchdogToggle');
    const watchdogDescText = document.getElementById('watchdogDescText');
    const updateWatchdogUI = () => {
      if (!btnWatchdogToggle) return;
      btnWatchdogToggle.classList.toggle('active', this.handExitWatchdogEnabled);
      btnWatchdogToggle.textContent = this.handExitWatchdogEnabled ? '📷 ตรวจจับ: เปิด (200ms)' : '📷 ตรวจจับ: ปิด (2 วิ)';
      if (watchdogDescText) {
        if (this.handExitWatchdogEnabled) {
          watchdogDescText.innerHTML = '<strong>เปิด (200ms):</strong> เคลียร์เคอร์เซอร์ทันทีเมื่อมือหลุดจากกล้อง';
        } else {
          watchdogDescText.innerHTML = '<strong>ปิด (2 วิ - แนะนำ):</strong> คงตำแหน่งขอบจอไว้ 2 วินาที ป้องกันแทร็กหลุดเมื่อลากฟันมัลแวร์สุดขอบจอหรือล่างจอ';
        }
      }
    };
    btnWatchdogToggle?.addEventListener('click', () => {
      audio.init();
      audio.playCountdown(false);
      this.handExitWatchdogEnabled = !this.handExitWatchdogEnabled;
      try {
        localStorage.setItem('cyber_ninja_watchdog', JSON.stringify(this.handExitWatchdogEnabled));
      } catch (e) {}
      updateWatchdogUI();
      this.mediaPipe.updateStatus(
        this.handExitWatchdogEnabled ? '📷 ตรวจจับมือออกจอ: เปิด (200ms)' : '📷 ตรวจจับมือออกจอ: ปิด (คงตำแหน่ง 2 วิ)',
        this.handExitWatchdogEnabled ? '#ffb703' : '#00ffcc'
      );
    });
    updateWatchdogUI();

    // Settings Modal Open / Close & Auto-Pause
    const openSettings = () => {
      audio.init();
      audio.playCountdown(false);

      // When settings is clicked or touched, pause game if currently active
      if (this.currentState !== 'MENU' && !this.isPaused) {
        this.togglePause();
      }

      updateWatchdogUI();
      document.getElementById('settingsModal')?.classList.remove('hidden');
    };

    document.getElementById('btnSettingsToggle')?.addEventListener('click', openSettings);

    const closeSettings = () => {
      document.getElementById('settingsModal')?.classList.add('hidden');
    };
    document.getElementById('btnCloseSettingsModal')?.addEventListener('click', closeSettings);
    document.getElementById('btnCloseSettingsModalX')?.addEventListener('click', closeSettings);

    document.getElementById('btnBackMenu')?.addEventListener('click', () => {
      audio.init();
      audio.playCountdown(false);
      this.returnToMenu();
    });

    // Dual Independent Volume Sliders & Mute Toggle
    const bgmSlider = document.getElementById('sliderBgmVolume');
    const bgmVal = document.getElementById('labelBgmVol') || document.getElementById('valBgmVolume');
    bgmSlider?.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value) / 100;
      audio.setBgmVolume(vol);
      if (bgmVal) bgmVal.textContent = `${Math.round(vol * 100)}%`;
    });

    const sfxSlider = document.getElementById('sliderSfxVolume');
    const sfxVal = document.getElementById('labelSfxVol') || document.getElementById('valSfxVolume');
    sfxSlider?.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value) / 100;
      audio.setSfxVolume(vol);
      if (sfxVal) sfxVal.textContent = `${Math.round(vol * 100)}%`;
    });

    document.getElementById('btnMuteToggle')?.addEventListener('click', () => {
      const isMuted = audio.toggleMute();
      const btn = document.getElementById('btnMuteToggle');
      if (btn) btn.textContent = isMuted ? '🔇' : '🔊';
    });

    // In-game Pause Button & Keyboard Hook
    document.getElementById('btnPauseToggle')?.addEventListener('click', () => {
      this.togglePause();
    });

    document.getElementById('btnResumeGame')?.addEventListener('click', () => {
      this.togglePause();
    });

    document.getElementById('btnRestartGame')?.addEventListener('click', () => {
      this.confirmRestart(() => {
        this.isPaused = false;
        document.getElementById('pauseModal')?.classList.add('hidden');
        if (this.currentState === 'PLAYING_MODE1') this.startMode1();
        else if (this.currentState === 'PLAYING_MODE2') this.startMode2();
        else if (this.currentState === 'PLAYING_MODE3') this.startMode3();
      });
    });

    document.getElementById('btnQuitToMenu')?.addEventListener('click', () => {
      this.isPaused = false;
      document.getElementById('pauseModal')?.classList.add('hidden');
      this.returnToMenu();
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape' || e.code === 'KeyP') {
        const zoomModal = document.getElementById('imageZoomModal');
        const howToModal = document.getElementById('howToPlayModal');
        const lbModal = document.getElementById('leaderboardModal');
        const resModal = document.getElementById('resultsModal');
        const duelModal = document.getElementById('duelResultModal');
        const bossModal = document.getElementById('bossResultModal');

        // If another modal is open, don't trigger pause
        if ((zoomModal && !zoomModal.classList.contains('hidden')) ||
            (howToModal && !howToModal.classList.contains('hidden')) ||
            (lbModal && !lbModal.classList.contains('hidden')) ||
            (resModal && !resModal.classList.contains('hidden')) ||
            (duelModal && !duelModal.classList.contains('hidden')) ||
            (bossModal && !bossModal.classList.contains('hidden'))) {
          return;
        }

        if (this.currentState !== 'MENU') {
          this.togglePause();
        }
      }
    });

    // Main Menu Mode Cards & Play Buttons
    const handleMode1Start = () => {
      audio.init();
      audio.playCountdown(true);
      this.startMode1();
    };
    document.getElementById('cardMode1')?.addEventListener('click', (e) => {
      if (e.target.closest('select, input, label, button, .mode-config-row')) return;
      handleMode1Start();
    });
    document.getElementById('btnStartMode1')?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleMode1Start();
    });

    const handleMode2Start = () => {
      audio.init();
      audio.playCountdown(true);
      this.startMode2();
    };
    document.getElementById('cardMode2')?.addEventListener('click', (e) => {
      if (e.target.closest('select, input, label, button, .mode-config-row')) return;
      handleMode2Start();
    });
    document.getElementById('btnStartMode2')?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleMode2Start();
    });

    const handleMode3Start = () => {
      audio.init();
      audio.playCountdown(true);
      this.startMode3();
    };
    document.getElementById('cardMode3')?.addEventListener('click', (e) => {
      if (e.target.closest('select, input, label, button, .mode-config-row')) return;
      handleMode3Start();
    });
    document.getElementById('btnStartMode3')?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleMode3Start();
    });

    document.getElementById('btnOpenLeaderboard')?.addEventListener('click', () => {
      audio.init();
      audio.playCountdown(false);
      this.showLeaderboardModal();
    });

    document.getElementById('btnHowToPlay')?.addEventListener('click', () => {
      audio.init();
      audio.playCountdown(false);
      this.showHowToPlayModal();
    });

    // Tutorial Slide Presentation Controller
    this.currentTutorialSlide = 0;
    const slides = document.querySelectorAll('.tutorial-slide');
    const tabs = document.querySelectorAll('.tutorial-tab-btn');
    const dots = document.querySelectorAll('.tutorial-indicator-dot');

    const setTutorialSlide = (index) => {
      if (slides.length === 0) return;
      this.currentTutorialSlide = (index + slides.length) % slides.length;
      slides.forEach((s, idx) => s.classList.toggle('active', idx === this.currentTutorialSlide));
      tabs.forEach((t, idx) => t.classList.toggle('active', idx === this.currentTutorialSlide));
      dots.forEach((d, idx) => d.classList.toggle('active', idx === this.currentTutorialSlide));
    };

    tabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        audio.playCountdown(false);
        setTutorialSlide(idx);
      });
    });

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        audio.playCountdown(false);
        setTutorialSlide(idx);
      });
    });

    document.getElementById('btnTutorialPrev')?.addEventListener('click', () => {
      audio.playCountdown(false);
      setTutorialSlide(this.currentTutorialSlide - 1);
    });

    document.getElementById('btnTutorialNext')?.addEventListener('click', () => {
      audio.playCountdown(false);
      setTutorialSlide(this.currentTutorialSlide + 1);
    });

    document.getElementById('btnTutorialStart')?.addEventListener('click', () => {
      document.getElementById('howToPlayModal')?.classList.add('hidden');
      audio.playCountdown(true);
      this.startMode1();
    });

    // Modal Close Buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.cyber-modal');
        if (modal) modal.classList.add('hidden');
      });
    });

    document.getElementById('btnExportCsv')?.addEventListener('click', () => {
      leaderboard.exportCSV();
    });

    document.getElementById('btnClearLeaderboard')?.addEventListener('click', () => {
      if (confirm(i18n.t('confirmClear'))) {
        leaderboard.clear();
        this.renderLeaderboardTable();
      }
    });

    // Mode 1 Results Modal Save
    document.getElementById('btnSaveScore')?.addEventListener('click', () => {
      const nameInput = document.getElementById('inputPlayerName');
      const playerName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'Cyber Ninja';
      
      if (this.lastResultData) {
        leaderboard.addScore({
          playerName: playerName,
          teamId: this.lastResultData.teamId || 'alpha',
          score: this.lastResultData.score || 0,
          maxCombo: this.lastResultData.maxCombo || 0,
          malwareSlain: this.lastResultData.malwareSlain || 0,
          safePacketsCaught: this.lastResultData.safePacketsCaught || 0,
          mode: 'Score Attack'
        });
      }

      document.getElementById('resultsModal')?.classList.add('hidden');
      this.showLeaderboardModal();
    });

    document.getElementById('btnPlayAgain')?.addEventListener('click', () => {
      this.confirmRestart(() => {
        document.getElementById('resultsModal')?.classList.add('hidden');
        this.startMode1();
      });
    });

    document.getElementById('btnMode1BackMenu')?.addEventListener('click', () => {
      document.getElementById('resultsModal')?.classList.add('hidden');
      this.returnToMenu();
    });

    // Mode 2 Duel Results Modal Handlers
    document.getElementById('btnSaveDuelScore')?.addEventListener('click', () => {
      const p1Name = document.getElementById('inputDuelP1Name')?.value.trim() || 'Ninja Blue';
      const p2Name = document.getElementById('inputDuelP2Name')?.value.trim() || 'Ninja Red';

      if (this.lastDuelResult) {
        leaderboard.addScore({
          playerName: `${p1Name} (P1 Blue)`,
          teamId: 'alpha',
          score: this.lastDuelResult.p1.score,
          maxCombo: this.lastDuelResult.p1.maxCombo,
          malwareSlain: this.lastDuelResult.p1.slashed,
          safePacketsCaught: this.lastDuelResult.p1.caught,
          mode: '1v1 Duel'
        });
        leaderboard.addScore({
          playerName: `${p2Name} (P2 Red)`,
          teamId: 'beta',
          score: this.lastDuelResult.p2.score,
          maxCombo: this.lastDuelResult.p2.maxCombo,
          malwareSlain: this.lastDuelResult.p2.slashed,
          safePacketsCaught: this.lastDuelResult.p2.caught,
          mode: '1v1 Duel'
        });
      }

      document.getElementById('duelResultModal')?.classList.add('hidden');
      this.showLeaderboardModal();
    });

    document.getElementById('btnRematchDuel')?.addEventListener('click', () => {
      this.confirmRestart(() => {
        document.getElementById('duelResultModal')?.classList.add('hidden');
        this.startMode2();
      });
    });

    document.getElementById('btnDuelBackMenu')?.addEventListener('click', () => {
      document.getElementById('duelResultModal')?.classList.add('hidden');
      this.returnToMenu();
    });

    // Mode 3 Boss Results Modal Handlers
    document.getElementById('btnSaveBossScore')?.addEventListener('click', () => {
      const teamName = document.getElementById('inputBossTeamName')?.value.trim() || 'Cyber Defense Unit';
      if (this.lastBossResult) {
        leaderboard.addScore({
          playerName: `${teamName} (Boss Raid)`,
          teamId: 'delta',
          score: this.lastBossResult.score,
          maxCombo: this.lastBossResult.ultimatesFired,
          malwareSlain: this.lastBossResult.malwareSlain,
          safePacketsCaught: this.lastBossResult.safeCaught,
          mode: 'Co-op Boss'
        });
      }

      document.getElementById('bossResultModal')?.classList.add('hidden');
      this.showLeaderboardModal();
    });

    document.getElementById('btnBossPlayAgain')?.addEventListener('click', () => {
      this.confirmRestart(() => {
        document.getElementById('bossResultModal')?.classList.add('hidden');
        this.startMode3();
      });
    });

    document.getElementById('btnBossBackMenu')?.addEventListener('click', () => {
      document.getElementById('bossResultModal')?.classList.add('hidden');
      this.returnToMenu();
    });

    // Asset Manager Modal Controls & Data Sync
    const openAssetModal = () => {
      audio.init();
      audio.playCountdown(false);
      const modal = document.getElementById('assetManagerModal');
      const banner = document.getElementById('syncStatusBanner');
      if (banner) {
        banner.className = 'sync-banner hidden';
        banner.textContent = '';
      }

      if (window.assetManager) {
        const aud = window.assetManager.audioPaths || {};
        const img = window.assetManager.imageFallbacks || {};

        const setVal = (id, val) => {
          const el = document.getElementById(id);
          if (el && val !== undefined) el.value = val;
        };

        setVal('assetAudioMenu', aud['bgm_menu']);
        setVal('assetAudioMode1', aud['bgm_mode1']);
        setVal('assetAudioMode2', aud['bgm_mode2']);
        setVal('assetAudioMode3', aud['bgm_mode3']);

        setVal('assetImgBoss1', img['boss_level1']);
        setVal('assetImgBoss2', img['boss_level2']);
        setVal('assetImgBoss3', img['boss_level3']);
        setVal('assetImgBoss4', img['boss_level4']);
        setVal('assetImgBoss5', img['boss_level5']);
        setVal('assetImgLogo', img['logo']);
      }

      modal?.classList.remove('hidden');
    };

    document.getElementById('btnOpenAssetManager')?.addEventListener('click', openAssetModal);
    document.getElementById('btnOpenAssetManagerBottom')?.addEventListener('click', openAssetModal);

    const closeAssetModal = () => {
      document.getElementById('assetManagerModal')?.classList.add('hidden');
    };
    document.getElementById('btnCloseAssetModal')?.addEventListener('click', closeAssetModal);
    document.getElementById('btnCloseAssetModalX')?.addEventListener('click', closeAssetModal);

    document.getElementById('btnSyncAssets')?.addEventListener('click', () => {
      audio.init();
      const banner = document.getElementById('syncStatusBanner');
      const customData = {
        audio: {
          'bgm_menu': document.getElementById('assetAudioMenu')?.value || '',
          'bgm_mode1': document.getElementById('assetAudioMode1')?.value || '',
          'bgm_mode2': document.getElementById('assetAudioMode2')?.value || '',
          'bgm_mode3': document.getElementById('assetAudioMode3')?.value || ''
        },
        images: {
          'boss_level1': document.getElementById('assetImgBoss1')?.value || '',
          'boss_level2': document.getElementById('assetImgBoss2')?.value || '',
          'boss_level3': document.getElementById('assetImgBoss3')?.value || '',
          'boss_level4': document.getElementById('assetImgBoss4')?.value || '',
          'boss_level5': document.getElementById('assetImgBoss5')?.value || '',
          'logo': document.getElementById('assetImgLogo')?.value || ''
        }
      };

      if (window.assetManager) {
        const ok = window.assetManager.syncCustomData(customData);
        if (ok) {
          audio.playCountdown(true);
          if (banner) {
            banner.textContent = '✅ ซิงค์ข้อมูลเข้าเกมสำเร็จ! บันทึกและนำเข้าสู่ระบบเกมเรียบร้อยแล้ว';
            banner.className = 'sync-banner success';
            banner.classList.remove('hidden');
          }
          if (this.currentState === 'MENU') {
            audio.playMenuBGM();
          }
        } else {
          if (banner) {
            banner.textContent = '❌ เกิดข้อผิดพลาดในการซิงค์ข้อมูล โปรดตรวจสอบรูปแบบข้อมูล';
            banner.className = 'sync-banner error';
            banner.classList.remove('hidden');
          }
        }
      }
    });

    document.getElementById('btnResetAssets')?.addEventListener('click', () => {
      audio.init();
      audio.playCountdown(false);
      const banner = document.getElementById('syncStatusBanner');
      if (window.assetManager) {
        window.assetManager.resetDefaults();
        const aud = window.assetManager.audioPaths || {};
        const img = window.assetManager.imageFallbacks || {};

        const setVal = (id, val) => {
          const el = document.getElementById(id);
          if (el && val !== undefined) el.value = val;
        };

        setVal('assetAudioMenu', aud['bgm_menu']);
        setVal('assetAudioMode1', aud['bgm_mode1']);
        setVal('assetAudioMode2', aud['bgm_mode2']);
        setVal('assetAudioMode3', aud['bgm_mode3']);

        setVal('assetImgBoss1', img['boss_level1']);
        setVal('assetImgBoss2', img['boss_level2']);
        setVal('assetImgBoss3', img['boss_level3']);
        setVal('assetImgBoss4', img['boss_level4']);
        setVal('assetImgBoss5', img['boss_level5']);
        setVal('assetImgLogo', img['logo']);

        if (banner) {
          banner.textContent = '↩️ คืนค่าไฟล์เริ่มต้นสำเร็จเรียบร้อยแล้ว';
          banner.className = 'sync-banner success';
          banner.classList.remove('hidden');
        }

        if (this.currentState === 'MENU') {
          audio.playMenuBGM();
        }
      }
    });

    // Initialize Interactive Image Zoom Lightbox
    this.initImageZoomLightbox();

    this.updateAllTexts();
  }

  togglePause() {
    if (this.currentState === 'MENU') return;
    this.isPaused = !this.isPaused;
    const modal = document.getElementById('pauseModal');
    if (this.isPaused) {
      audio.pauseBGM();
      modal?.classList.remove('hidden');
    } else {
      modal?.classList.add('hidden');
      audio.resumeBGM();
    }
  }

  confirmRestart(onConfirm, customMsg = null) {
    audio.init();
    audio.playCountdown(false);
    const modal = document.getElementById('confirmRestartModal');
    if (!modal) {
      if (confirm('คุณต้องการเริ่มเล่นรอบใหม่ทันทีใช่หรือไม่? (สถิติปัจจุบันที่ยังไม่ได้บันทึกจะหายไป)')) {
        onConfirm();
      }
      return;
    }

    const msgEl = document.getElementById('confirmRestartMessage');
    if (msgEl && customMsg) {
      msgEl.innerHTML = customMsg;
    } else if (msgEl) {
      msgEl.innerHTML = 'คุณต้องการเริ่มเล่นรอบใหม่ทันทีใช่หรือไม่?<br><span style="color: var(--magenta-neon); font-size: 0.92rem; font-weight: 700;">(หากยังไม่ได้บันทึกคะแนน สถิติการเล่นรอบนี้จะไม่ถูกบันทึก)</span>';
    }

    modal.classList.remove('hidden');

    const btnYes = document.getElementById('btnConfirmRestartYes');
    const btnNo = document.getElementById('btnConfirmRestartNo');

    const handleYes = () => {
      cleanup();
      modal.classList.add('hidden');
      audio.playCountdown(true);
      onConfirm();
    };

    const handleNo = () => {
      cleanup();
      modal.classList.add('hidden');
      audio.playCountdown(false);
    };

    const cleanup = () => {
      btnYes?.removeEventListener('click', handleYes);
      btnNo?.removeEventListener('click', handleNo);
    };

    btnYes?.addEventListener('click', handleYes, { once: true });
    btnNo?.addEventListener('click', handleNo, { once: true });
  }

  initImageZoomLightbox() {
    const zoomModal = document.getElementById('imageZoomModal');
    const viewport = document.getElementById('zoomViewport');
    const canvasWrapper = document.getElementById('zoomCanvasWrapper');
    const targetImg = document.getElementById('zoomTargetImg');
    const titleEl = document.getElementById('zoomImageTitle');
    const pctBadge = document.getElementById('zoomPctBadge');
    const btnIn = document.getElementById('btnZoomIn');
    const btnOut = document.getElementById('btnZoomOut');
    const btnReset = document.getElementById('btnZoomReset');
    const btnClose = document.getElementById('btnCloseZoomModal');

    if (!zoomModal || !viewport || !canvasWrapper || !targetImg) return;

    let scale = 1.0;
    let translateX = 0;
    let translateY = 0;
    const minScale = 0.6;
    const maxScale = 5.0;

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialTranslateX = 0;
    let initialTranslateY = 0;

    let initialPinchDist = 0;
    let initialPinchScale = 1.0;

    const applyTransform = () => {
      if (pctBadge) {
        pctBadge.textContent = `${Math.round(scale * 100)}%`;
      }
      canvasWrapper.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    };

    const resetZoom = () => {
      scale = 1.0;
      translateX = 0;
      translateY = 0;
      applyTransform();
    };

    const zoomBy = (factor) => {
      scale = Math.min(Math.max(scale + factor, minScale), maxScale);
      scale = Math.round(scale * 100) / 100;
      applyTransform();
    };

    const openModal = (imgSrc, imgAlt) => {
      targetImg.src = imgSrc;
      if (titleEl) titleEl.textContent = `🔍 ${imgAlt || 'ภาพประกอบคู่มือนินจาไซเบอร์'}`;
      resetZoom();
      zoomModal.classList.remove('hidden');
      audio.init();
      audio.playCountdown(false);
    };

    const closeModal = () => {
      zoomModal.classList.add('hidden');
      resetZoom();
    };

    document.querySelectorAll('.tutorial-diagram-box').forEach(box => {
      box.addEventListener('click', (e) => {
        const img = box.querySelector('img');
        if (img) openModal(img.getAttribute('src'), img.getAttribute('alt') || box.getAttribute('title'));
      });
    });

    btnIn?.addEventListener('click', (e) => { e.stopPropagation(); zoomBy(0.25); });
    btnOut?.addEventListener('click', (e) => { e.stopPropagation(); zoomBy(-0.25); });
    btnReset?.addEventListener('click', (e) => { e.stopPropagation(); resetZoom(); });
    btnClose?.addEventListener('click', (e) => { e.stopPropagation(); closeModal(); });

    zoomModal.addEventListener('click', (e) => {
      if (e.target === zoomModal || e.target === viewport) closeModal();
    });

    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.20 : -0.20;
      zoomBy(delta);
    }, { passive: false });

    viewport.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      initialTranslateX = translateX;
      initialTranslateY = translateY;
      viewport.classList.add('dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      translateX = initialTranslateX + (e.clientX - dragStartX);
      translateY = initialTranslateY + (e.clientY - dragStartY);
      applyTransform();
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        viewport.classList.remove('dragging');
      }
    });

    viewport.addEventListener('dblclick', (e) => {
      e.preventDefault();
      if (scale !== 1.0) resetZoom();
      else { scale = 2.0; applyTransform(); }
    });

    viewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDist = Math.hypot(dx, dy);
        initialPinchScale = scale;
      } else if (e.touches.length === 1) {
        isDragging = true;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
        initialTranslateX = translateX;
        initialTranslateY = translateY;
      }
    }, { passive: false });

    viewport.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && initialPinchDist > 0) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDist = Math.hypot(dx, dy);
        const ratio = currentDist / initialPinchDist;
        const nextScale = Math.min(Math.max(initialPinchScale * ratio, minScale), maxScale);
        scale = Math.round(nextScale * 100) / 100;
        applyTransform();
      } else if (e.touches.length === 1 && isDragging) {
        e.preventDefault();
        translateX = initialTranslateX + (e.touches[0].clientX - dragStartX);
        translateY = initialTranslateY + (e.touches[0].clientY - dragStartY);
        applyTransform();
      }
    }, { passive: false });

    viewport.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) initialPinchDist = 0;
      if (e.touches.length === 0) isDragging = false;
    });
  }

  async startCamera() {
    await this.mediaPipe.initCamera();
  }

  updateAllTexts() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = i18n.t(key);
      }
    });
  }

  startMode1() {
    this.currentState = 'PLAYING_MODE1';
    this.activeMode = this.mode1;
    this.isPaused = false;
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('gameHud').classList.remove('hidden');
    document.getElementById('btnBackMenu').classList.remove('hidden');
    document.getElementById('btnPauseToggle')?.classList.remove('hidden');
    
    const teamSelect = document.getElementById('selectCampTeam');
    const teamId = teamSelect ? teamSelect.value : 'alpha';
    const diffSelect = document.getElementById('selectDifficultyMode1');
    const diff = diffSelect ? diffSelect.value : 2;

    this.mode1.start(teamId, diff);
  }

  startMode2() {
    this.currentState = 'PLAYING_MODE2';
    this.activeMode = this.mode2;
    this.isPaused = false;
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('gameHud').classList.add('hidden');
    document.getElementById('btnBackMenu').classList.remove('hidden');
    document.getElementById('btnPauseToggle')?.classList.remove('hidden');

    const durSelect = document.getElementById('selectDuelDuration');
    const duration = durSelect ? parseInt(durSelect.value, 10) : 30;
    const roundsSelect = document.getElementById('selectDuelRounds');
    const rounds = roundsSelect ? parseInt(roundsSelect.value, 10) : 3;

    this.mode2.start(duration, rounds);
  }

  startMode3() {
    this.currentState = 'PLAYING_MODE3';
    this.activeMode = this.mode3;
    this.isPaused = false;
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('gameHud').classList.add('hidden');
    document.getElementById('btnBackMenu').classList.remove('hidden');
    document.getElementById('btnPauseToggle')?.classList.remove('hidden');

    const runnerSelect = document.getElementById('selectRelayRunners');
    const runners = runnerSelect ? parseInt(runnerSelect.value, 10) : 4;
    const durSelect = document.getElementById('selectRelayDuration');
    const duration = durSelect ? parseInt(durSelect.value, 10) : 15;
    const diffSelect = document.getElementById('selectDifficultyMode3');
    const diff = diffSelect ? parseInt(diffSelect.value, 10) : 2;

    this.mode3.start(runners, duration, diff);
  }

  returnToMenu() {
    this.currentState = 'MENU';
    this.isPaused = false;
    audio.playMenuBGM();

    if (this.activeMode) {
      this.activeMode.active = false;
    }
    this.activeMode = null;
    this.particles.clear();
    this.trailP1.clear();
    this.trailP2.clear();

    document.getElementById('mainMenu').classList.remove('hidden');
    document.getElementById('gameHud').classList.add('hidden');
    document.getElementById('btnBackMenu').classList.add('hidden');
    document.getElementById('btnPauseToggle')?.classList.add('hidden');
    document.getElementById('resultsModal').classList.add('hidden');
    document.getElementById('duelResultModal')?.classList.add('hidden');
    document.getElementById('bossResultModal')?.classList.add('hidden');
    document.getElementById('pauseModal')?.classList.add('hidden');
  }

  onHandResults(hands) {
    if (hands && hands.length > 0) {
      this.lastHandTimestamp = performance.now();
      this.detectedHands = [];

      for (const h of hands) {
        const processed = this.gestureDetector.processHand(h);
        this.detectedHands.push(processed);

        // Only add to blade trail if NOT in Open Palm catch mode
        if (!processed.isCatching) {
          if (processed.tip.x < CONFIG.CANVAS_WIDTH / 2) {
            this.trailP1.addPoint(processed.tip.x, processed.tip.y);
          } else {
            this.trailP2.addPoint(processed.tip.x, processed.tip.y);
          }
        }

        // If moving fast and slashing, emit trailing sparks
        if (processed.isSlashing) {
          const sparkColor = processed.tip.x < CONFIG.CANVAS_WIDTH / 2 ? '#00f3ff' : '#ff0055';
          this.particles.emitSparks(processed.tip.x, processed.tip.y, sparkColor, 2, 180);
        } else if (processed.isCatching && Math.random() < 0.25) {
          // Subtle magnetic containment energy motes around open palm
          this.particles.emitSparks(processed.palm.x + (Math.random() - 0.5) * 30, processed.palm.y + (Math.random() - 0.5) * 30, '#ffb703', 1, 60);
        }
      }
    } else {
      // Empty hands received
      if (this.handExitWatchdogEnabled) {
        // Immediate clear when watchdog is enabled
        this.detectedHands = [];
        this.trailP1.clear();
        this.trailP2.clear();
      }
      // When watchdog is disabled, retain this.detectedHands for 2.0s before clearing in update(dt)
    }
  }

  onModeComplete(resultData) {
    this.lastResultData = resultData;
    const modal = document.getElementById('resultsModal');
    if (!modal) return;

    document.getElementById('resScore').textContent = resultData.score !== undefined ? resultData.score.toLocaleString() : '-';
    document.getElementById('resCombo').textContent = resultData.maxCombo ? `x${resultData.maxCombo}` : '-';
    document.getElementById('resSlashed').textContent = resultData.malwareSlain !== undefined ? resultData.malwareSlain : '-';
    document.getElementById('resCaught').textContent = resultData.safePacketsCaught !== undefined ? resultData.safePacketsCaught : '-';
    document.getElementById('resPenalties').textContent = resultData.penalties !== undefined ? resultData.penalties : '-';

    modal.classList.remove('hidden');
  }

  onDuelComplete(duelResult) {
    this.lastDuelResult = duelResult;
    const modal = document.getElementById('duelResultModal');
    if (!modal) return;

    const banner = document.getElementById('duelWinnerBanner');
    if (banner) {
      if (duelResult.winner === 'P1') {
        banner.textContent = '🏆 PLAYER 1 (BLUE) ชนะการประลอง!';
        banner.style.color = '#00e5ff';
      } else if (duelResult.winner === 'P2') {
        banner.textContent = '🏆 PLAYER 2 (RED) ชนะการประลอง!';
        banner.style.color = '#ff0055';
      } else {
        banner.textContent = '🤝 เสมอกันในการประลอง! (DRAW)';
        banner.style.color = '#ffb703';
      }
    }

    document.getElementById('duelP1Score').textContent = duelResult.p1.score.toLocaleString();
    document.getElementById('duelP1Rounds').textContent = duelResult.p1.roundsWon;
    document.getElementById('duelP1Slashed').textContent = duelResult.p1.slashed;
    document.getElementById('duelP1Caught').textContent = duelResult.p1.caught;
    document.getElementById('duelP1Penalties').textContent = duelResult.p1.penalties;

    document.getElementById('duelP2Score').textContent = duelResult.p2.score.toLocaleString();
    document.getElementById('duelP2Rounds').textContent = duelResult.p2.roundsWon;
    document.getElementById('duelP2Slashed').textContent = duelResult.p2.slashed;
    document.getElementById('duelP2Caught').textContent = duelResult.p2.caught;
    document.getElementById('duelP2Penalties').textContent = duelResult.p2.penalties;

    modal.classList.remove('hidden');
  }

  onBossFightComplete(bossResult) {
    this.lastBossResult = bossResult;
    const modal = document.getElementById('bossResultModal');
    if (!modal) return;

    const modalTitle = modal.querySelector('.modal-title');
    if (modalTitle) {
      modalTitle.textContent = `🛡️ สรุปผลศึกกำราบ ${bossResult.bossName || 'มัลแวร์บอส'}`;
    }

    const banner = document.getElementById('bossResultBanner');
    if (banner) {
      if (bossResult.victory) {
        banner.textContent = `🏆 ภารกิจสำเร็จ! กำราบ ${bossResult.bossName || 'มัลแวร์บอส'} สำเร็จ!`;
        banner.className = 'boss-banner-victory';
      } else {
        banner.textContent = '💀 ภารกิจล้มเหลว! เซิร์ฟเวอร์โรงเรียนถูกทำลาย!';
        banner.className = 'boss-banner-defeat';
      }
    }

    document.getElementById('bossFinalScore').textContent = bossResult.score.toLocaleString();
    const hpRatio = bossResult.bossMaxHp > 0 ? (bossResult.bossHp / bossResult.bossMaxHp) * 100 : 0;
    document.getElementById('bossRemainingHp').textContent = `${Math.round(hpRatio)}%`;
    document.getElementById('bossDiffLabel').textContent = bossResult.difficulty;
    document.getElementById('bossTotalSlashed').textContent = bossResult.malwareSlain;
    document.getElementById('bossTotalUltimates').textContent = `${bossResult.ultimatesFired} ครั้ง`;

    modal.classList.remove('hidden');
  }

  showLeaderboardModal() {
    this.renderLeaderboardTable();
    document.getElementById('leaderboardModal')?.classList.remove('hidden');
  }

  showHowToPlayModal() {
    document.getElementById('howToPlayModal')?.classList.remove('hidden');
  }

  renderLeaderboardTable() {
    const tbody = document.getElementById('leaderboardBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const scores = leaderboard.getAllScores();
    if (scores.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px; color: rgba(255,255,255,0.5); font-style: italic;">ยังไม่มีบันทึกคะแนนในค่าย / No records yet</td></tr>`;
      return;
    }

    scores.forEach((s, idx) => {
      const tr = document.createElement('tr');
      const rankBadge = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `${idx + 1}`));
      tr.innerHTML = `
        <td style="font-weight:900; font-size:1.1rem; color:#ffb703;">${rankBadge}</td>
        <td style="font-weight:700; color:#00f3ff;">${s.playerName}</td>
        <td><span class="team-tag team-${s.teamId}">${s.teamId.toUpperCase()}</span></td>
        <td style="font-weight:900; color:#00ff66; font-size:1.2rem;">${s.score.toLocaleString()}</td>
        <td>${s.maxCombo ? `x${s.maxCombo}` : '-'}</td>
        <td style="font-size:0.85rem; opacity:0.8;">${s.date}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  startRenderLoop() {
    const loop = (timestamp) => {
      const dt = Math.min((timestamp - this.lastFrameTime) / 1000, 0.1);
      this.lastFrameTime = timestamp;

      if (!this.isPaused) {
        this.update(dt);
      }
      this.render();

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  update(dt) {
    // Watchdog: If watchdog is enabled, timeout is 200ms (quick clear when hands leave).
    // If watchdog is disabled (default/recommended), timeout is 2000ms (2 seconds) so cursor stays at the edge/bottom of screen.
    const watchdogTimeout = this.handExitWatchdogEnabled ? 200 : 2000;
    if (performance.now() - this.lastHandTimestamp > watchdogTimeout) {
      this.detectedHands = [];
      this.trailP1.clear();
      this.trailP2.clear();
    }

    this.trailP1.update();
    this.trailP2.update();
    this.particles.update(dt);

    if (this.activeMode && this.activeMode.active) {
      this.activeMode.update(dt, this.detectedHands);
      this.updateHUD();
    }
  }

  updateHUD() {
    if (this.currentState === 'PLAYING_MODE1') {
      const hud = document.getElementById('gameHud');
      if (this.mode1 && this.mode1.activeQuiz) {
        hud?.classList.add('hidden');
        return;
      }
      hud?.classList.remove('hidden');
      document.getElementById('hudTimer').textContent = `${Math.ceil(this.mode1.timeLeft)}s`;
      document.getElementById('hudScore').textContent = this.mode1.score.toLocaleString();
      document.getElementById('hudCombo').textContent = `x${this.mode1.getMultiplier()} (${this.mode1.combo})`;
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Render Active Game Mode Entities
    if (this.activeMode && this.activeMode.active) {
      this.activeMode.render(this.ctx);
    }

    // 2. Render Cyber Blade Trails (P1 Cyan, P2 Magenta)
    this.trailP1.render(this.ctx);
    this.trailP2.render(this.ctx);

    // 3. Render Hand Posture & HUD Badges (Open Palm Shield vs 1-Finger Knife Blade with Red Tracker Dot)
    const time = performance.now() * 0.003;
    for (const h of this.detectedHands) {
      if (h.isCatching) {
        this.ctx.save();
        this.ctx.translate(h.palm.x, h.palm.y);

        // Rotating Cyber Hex-Shield Ring
        this.ctx.rotate(time);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, CONFIG.PALM_CATCH_RADIUS, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#00f3ff';
        this.ctx.lineWidth = 2.5;
        this.ctx.setLineDash([12, 8]);
        this.ctx.shadowBlur = 18;
        this.ctx.shadowColor = '#00f3ff';
        this.ctx.stroke();

        // Inner Gold Pulse Ring
        this.ctx.beginPath();
        this.ctx.arc(0, 0, CONFIG.PALM_CATCH_RADIUS * 0.7, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#ffb703';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([6, 6]);
        this.ctx.stroke();

        this.ctx.rotate(-time); // Reset rotation for text
        this.ctx.font = 'bold 13px "Rajdhani", "Kanit", sans-serif';
        this.ctx.fillStyle = '#ffb703';
        this.ctx.textAlign = 'center';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = '#ffb703';
        this.ctx.fillText('✋ SHIELD (กาง 5 นิ้วรับ)', 0, CONFIG.PALM_CATCH_RADIUS + 22);
        this.ctx.restore();
      } else {
        // SINGLE-FINGER KNIFE BLADE (🗡️ ชี้ 1 นิ้วมีด/ดาบ)
        // Vivid Red Circular Aiming Reticle on Fingertip (แสดงแสงสีแดงกลมบนปลายนิ้วทุกครั้งเพื่อใช้เล็ง)
        this.ctx.save();

        const pulse = 1.0 + Math.sin(time * 3.5) * 0.15;

        // 1. Outer Pulsing Neon Red Ring
        this.ctx.beginPath();
        this.ctx.arc(h.tip.x, h.tip.y, 20 * pulse, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#ff0055';
        this.ctx.lineWidth = 2.5;
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = '#ff0033';
        this.ctx.stroke();

        // 2. Precision Laser Crosshairs
        this.ctx.beginPath();
        this.ctx.moveTo(h.tip.x - 26, h.tip.y);
        this.ctx.lineTo(h.tip.x - 14, h.tip.y);
        this.ctx.moveTo(h.tip.x + 14, h.tip.y);
        this.ctx.lineTo(h.tip.x + 26, h.tip.y);
        this.ctx.moveTo(h.tip.x, h.tip.y - 26);
        this.ctx.lineTo(h.tip.x, h.tip.y - 14);
        this.ctx.moveTo(h.tip.x, h.tip.y + 14);
        this.ctx.lineTo(h.tip.x, h.tip.y + 26);
        this.ctx.strokeStyle = '#ff0033';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // 3. Solid Crimson Circular Aiming Orb
        this.ctx.beginPath();
        this.ctx.arc(h.tip.x, h.tip.y, 9, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ff0033';
        this.ctx.shadowBlur = 16;
        this.ctx.shadowColor = '#ff0033';
        this.ctx.fill();

        // 4. Ultra Bright White Laser Diode Core
        this.ctx.beginPath();
        this.ctx.arc(h.tip.x, h.tip.y, 4, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = '#ffffff';
        this.ctx.fill();

        // Text Label above fingertip
        this.ctx.font = 'bold 12px "Rajdhani", "Kanit", sans-serif';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = '#ff0033';
        this.ctx.fillText('🎯 จุดเล็งฟัน (BLADE)', h.tip.x, h.tip.y - 28);
        this.ctx.restore();
      }
    }

    // 4. Render Particle VFX & Screen Flashes
    this.particles.render(this.ctx);
  }
}

// Robust Bootstrap: Works both on DOMContentLoaded AND if script is loaded after parse
function bootCyberNinja() {
  if (window.cyberNinjaGame) return;
  const game = new CyberNinjaGame();
  window.cyberNinjaGame = game;
  game.startCamera().catch(err => {
    console.warn('Non-blocking camera notice:', err);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootCyberNinja);
} else {
  bootCyberNinja();
}
