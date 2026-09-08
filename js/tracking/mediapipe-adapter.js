// Cyber Ninja: Firewall Slasher - MediaPipe Hands Adapter & Hybrid Tracking Controller

export class MediaPipeAdapter {
  constructor(videoElement, canvasElement, onResultsCallback) {
    this.video = videoElement;
    this.canvas = canvasElement;
    this.onResults = onResultsCallback;
    
    this.hands = null;
    this.camera = null;
    this.isCameraActive = false;
    this.isSimulatedOnly = false; // True only if user explicitly toggles mouse-only mode
    
    // Virtual hands for simulator & mouse mode
    this.simHands = [];
    this.isSimOpenPalm = false;
    this.lastMousePos = null;
    this.lastMouseTime = performance.now();
    this.hasPhysicalHands = false;
    this.isFistDiscardEnabled = true; // Closed Fist Discard (กำหมัด = พักมือ)

    // Quality Mode: 'smooth' (Lite AI, 30 FPS inference, Zero ShadowBlur for tablets) vs 'high' (Full AI, PC glow)
    const isMobileOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                            (navigator.maxTouchPoints > 1 && window.innerWidth < 1400);
    let savedQuality = null;
    try {
      savedQuality = localStorage.getItem('cyber_ninja_quality');
    } catch (e) {}
    this.qualityMode = savedQuality || (isMobileOrTablet ? 'smooth' : 'high');
    window.isSmoothMode = (this.qualityMode === 'smooth');
    
    this.setupSimulatorEvents();
  }

  setQualityMode(mode) {
    this.qualityMode = mode === 'smooth' ? 'smooth' : 'high';
    window.isSmoothMode = (this.qualityMode === 'smooth');
    try {
      localStorage.setItem('cyber_ninja_quality', this.qualityMode);
    } catch (e) {}

    if (this.hands) {
      this.hands.setOptions({
        modelComplexity: this.qualityMode === 'smooth' ? 0 : 1
      });
    }
    return this.qualityMode;
  }

  toggleFistDiscard(state = null) {
    this.isFistDiscardEnabled = (state !== null) ? state : !this.isFistDiscardEnabled;
    return this.isFistDiscardEnabled;
  }

  updateStatus(text, color = '#00f3ff') {
    const pill = document.getElementById('trackingStatusPill');
    if (pill) {
      pill.textContent = text;
      pill.style.borderColor = color;
      pill.style.color = color;
      pill.style.textShadow = `0 0 10px ${color}`;
    }
  }

  async initCamera() {
    this.updateStatus('📷 กำลังเชื่อมต่อกล้องหน้า... / Connecting camera...', '#ffb703');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('getUserMedia not supported in this environment');
        this.updateStatus('🖱️ โหมดเมาส์/สัมผัสพร้อมเล่น (Mouse Mode Active)', '#00ff66');
        return false;
      }

      // 1. Request camera stream (Optimized resolution for tablets/mobile)
      let stream = null;
      const isSmooth = window.isSmoothMode;
      const videoConstraints = isSmooth 
        ? { width: { ideal: 960, max: 1280 }, height: { ideal: 540, max: 720 }, facingMode: 'user' }
        : { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' };

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: false
        });
      } catch (camErr) {
        console.warn('Camera access denied or unavailable:', camErr);
        this.updateStatus('🖱️ ไม่พบกล้อง/ใช้โหมดเมาส์และสัมผัส (Mouse Mode Active)', '#ffb703');
        return false;
      }

      this.video.srcObject = stream;
      await this.video.play();
      this.isCameraActive = true;

      // 2. Initialize MediaPipe Hands if library is loaded
      if (typeof window.Hands !== 'undefined') {
        this.hands = new window.Hands({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        // Use modelComplexity: 0 (Lite) for tablet/smooth mode (3x-4x faster inference!), 1 for high
        this.hands.setOptions({
          maxNumHands: 2,
          modelComplexity: this.qualityMode === 'smooth' ? 0 : 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        this.hands.onResults((results) => {
          this.processMediaPipeResults(results);
        });

        let isSending = false;
        let lastInferenceTime = 0;
        const frameLoop = async () => {
          if (this.isCameraActive && this.hands) {
            const now = performance.now();
            // Frame Pacing: Throttle hands.send() to ~30-33 FPS on tablets (32ms interval)
            // Prevents thermal throttling & 100% CPU lockup on 120Hz/144Hz screens!
            const minInterval = window.isSmoothMode ? 32 : 24;

            if (!isSending && (now - lastInferenceTime >= minInterval) && this.video.readyState >= 2 && this.video.videoWidth > 0) {
              isSending = true;
              lastInferenceTime = now;
              try {
                await this.hands.send({ image: this.video });
              } catch (e) {
                console.warn('Hands frame send warning:', e);
              }
              isSending = false;
            }
            requestAnimationFrame(frameLoop);
          }
        };
        requestAnimationFrame(frameLoop);
        this.updateStatus('🟢 ตรวจจับมือ AR พร้อมทำงาน (Hand Tracking Active)', '#00ff66');
        return true;
      } else {
        this.updateStatus('🟢 กล้องพร้อมทำงาน / ควบคุมด้วยเมาส์หรือสัมผัส', '#00ff66');
        return true;
      }
    } catch (err) {
      console.warn('Camera initialization completed with fallback:', err);
      this.updateStatus('🖱️ ควบคุมด้วยเมาส์/สัมผัส (Mouse Mode Active)', '#00ff66');
      return false;
    }
  }

  processMediaPipeResults(results) {
    const formattedHands = [];
    const width = this.canvas.width;
    const height = this.canvas.height;

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      for (let i = 0; i < results.multiHandLandmarks.length; i++) {
        const rawLandmarks = results.multiHandLandmarks[i];

        // 1. Lowered Hand Check: If wrist or palm is at the bottom boundary (y > 0.94),
        // the player has taken their hand down or is exiting frame! Discard immediately.
        if (rawLandmarks[0].y > 0.94) {
          continue;
        }

        const handedness = results.multiHandedness && results.multiHandedness[i] 
          ? results.multiHandedness[i].label 
          : (i === 0 ? 'Right' : 'Left');

        // Virtual Canvas Margin Compensation (Overscan Calibration)
        // Maps comfortable arm movement range [15%, 85%] horizontally and [10%, 90%] vertically to [0, 100%]
        // Guarantees effortless corner-to-corner reach across all 4 screen corners!
        const MARGIN_X = 0.15;       // 15% horizontal margin on each side
        const MARGIN_TOP = 0.10;     // 10% top margin
        const MARGIN_BOTTOM = 0.10;  // 10% bottom margin

        // Convert all landmarks to mirrored pixel coordinates with edge compensation
        const lmPixels = rawLandmarks.map(lm => {
          // Mirrored horizontal: 0 is right in camera, 1 is left
          const normX = 1.0 - lm.x;
          const scaledX = (normX - MARGIN_X) / (1.0 - 2 * MARGIN_X);
          const clampedX = Math.max(0, Math.min(1, scaledX)) * width;

          const scaledY = (lm.y - MARGIN_TOP) / (1.0 - MARGIN_TOP - MARGIN_BOTTOM);
          const clampedY = Math.max(0, Math.min(1, scaledY)) * height;

          return {
            x: clampedX,
            y: clampedY,
            z: lm.z
          };
        });

        const wrist = lmPixels[0];
        const indexMcp = lmPixels[5];
        const indexPip = lmPixels[6];
        const indexTip = lmPixels[8];
        const middleMcp = lmPixels[9];
        const middlePip = lmPixels[10];
        const middleTip = lmPixels[12];
        const ringPip = lmPixels[14];
        const ringTip = lmPixels[16];
        const pinkyPip = lmPixels[18];
        const pinkyTip = lmPixels[20];
        const palmCenter = middleMcp;

        // Scale-invariant palm reference size
        const palmSize = Math.hypot(middleMcp.x - wrist.x, middleMcp.y - wrist.y) || 60;

        // Distances of Tips and PIP joints from wrist
        const distIndexTip = Math.hypot(indexTip.x - wrist.x, indexTip.y - wrist.y);
        const distMiddleTip = Math.hypot(middleTip.x - wrist.x, middleTip.y - wrist.y);
        const distRingTip = Math.hypot(ringTip.x - wrist.x, ringTip.y - wrist.y);
        const distPinkyTip = Math.hypot(pinkyTip.x - wrist.x, pinkyTip.y - wrist.y);

        const distIndexPip = Math.hypot(indexPip.x - wrist.x, indexPip.y - wrist.y);
        const distMiddlePip = Math.hypot(middlePip.x - wrist.x, middlePip.y - wrist.y);
        const distRingPip = Math.hypot(ringPip.x - wrist.x, ringPip.y - wrist.y);
        const distPinkyPip = Math.hypot(pinkyPip.x - wrist.x, pinkyPip.y - wrist.y);

        // 2. CLOSED FIST DISCARD (กำหมัด = พักมือ):
        // If all 4 fingers are tightly curled toward palm/wrist, player is resting/disarming this hand
        const isFist = (distIndexTip <= distIndexPip * 1.08) &&
                       (distMiddleTip <= distMiddlePip * 1.08) &&
                       (distRingTip <= distRingPip * 1.08) &&
                       (distPinkyTip <= distPinkyPip * 1.08);

        if (this.isFistDiscardEnabled && isFist) {
          continue; // Discard clenched fist hand
        }

        // Individual finger extensions
        const isIndexExt = distIndexTip > distIndexPip * 1.10 && distIndexTip > palmSize * 1.0;
        const isMiddleExt = distMiddleTip > distMiddlePip * 1.08 && distMiddleTip > palmSize * 0.98;
        const isRingExt = distRingTip > distRingPip * 1.08 && distRingTip > palmSize * 0.90;
        const isPinkyExt = distPinkyTip > distPinkyPip * 1.08 && distPinkyTip > palmSize * 0.80;

        let extendedCount = 0;
        if (isIndexExt) extendedCount++;
        if (isMiddleExt) extendedCount++;
        if (isRingExt) extendedCount++;
        if (isPinkyExt) extendedCount++;

        // 1. OPEN PALM (✋ กางมือ 5 นิ้วรับ):
        // Active if 3+ fingers are extended, OR (index+middle+ring extended),
        // OR middle finger is prominently extended (in an open hand, middle finger is longest)
        const isOpenPalm = (extendedCount >= 3) || 
                           (isIndexExt && isMiddleExt && isRingExt) ||
                           (isMiddleExt && distMiddleTip > distIndexTip * 0.92);

        // 2. SINGLE-FINGER KNIFE BLADE (🗡️ ชี้ 1 นิ้วมีด/ดาบ):
        // Index finger extended without 3+ open fingers. Any non-open-palm, non-fist hand acts as a precision knife blade!
        const isIndexDominant = (distIndexTip > distMiddleTip * 1.05) &&
                                (distIndexTip > distRingTip * 1.08);
        const isSingleFingerBlade = (isIndexExt && isIndexDominant && !isOpenPalm) || (!isOpenPalm);
        const isKnifeHand = isSingleFingerBlade;

        formattedHands.push({
          id: i,
          handedness: handedness,
          wrist: wrist,
          indexTip: indexTip, // Anchor for blade tracking
          palmCenter: palmCenter,
          isOpenPalm: isOpenPalm,
          isKnifeHand: isKnifeHand,
          isSingleFingerBlade: isSingleFingerBlade,
          palmSize: palmSize,
          rawLandmarks: lmPixels
        });
      }
    }

    if (formattedHands.length > 0) {
      this.hasPhysicalHands = true;
      if (this.onResults) {
        this.onResults(formattedHands);
      }
    } else {
      // CRITICAL BUG FIX: When hands are lowered or out of frame,
      // IMMEDIATELY notify with empty array [] so game clears lingering ghost cursors!
      this.hasPhysicalHands = false;
      if (this.onResults) {
        this.onResults([]);
      }
    }
  }

  // Mouse & Touch Simulation fallback
  setupSimulatorEvents() {
    let isMouseDown = false;

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.isSimOpenPalm = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.isSimOpenPalm = false;
      }
    });

    const updateMouseHand = (clientX, clientY, isDown) => {
      // Only inject mouse hands if camera is NOT running OR user explicitly toggled simulator mode
      if (this.isCameraActive && !this.isSimulatedOnly) {
        return;
      }

      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / (rect.width || 1);
      const scaleY = this.canvas.height / (rect.height || 1);
      const rawX = (clientX - rect.left) * scaleX;
      const rawY = (clientY - rect.top) * scaleY;
      const x = Math.max(0, Math.min(this.canvas.width, rawX));
      const y = Math.max(0, Math.min(this.canvas.height, rawY));

      // When dragging or holding Spacebar -> open palm containment mode; otherwise -> knife hand blade mode
      const isCatchMode = this.isSimOpenPalm || isDown;

      this.simHands = [{
        id: 99,
        handedness: x < this.canvas.width / 2 ? 'Left' : 'Right',
        wrist: { x: x, y: y + 60, z: 0 },
        indexTip: { x: x, y: y, z: 0 },
        palmCenter: { x: x, y: y + 25, z: 0 },
        isOpenPalm: isCatchMode,
        isKnifeHand: !isCatchMode,
        isSingleFingerBlade: !isCatchMode,
        rawLandmarks: []
      }];

      if (this.onResults) {
        this.onResults(this.simHands);
      }
    };

    window.addEventListener('mousemove', (e) => {
      updateMouseHand(e.clientX, e.clientY, isMouseDown);
    });

    window.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      updateMouseHand(e.clientX, e.clientY, true);
    });

    window.addEventListener('mouseup', () => {
      isMouseDown = false;
    });

    // Touch event support for tablets & smartphones
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        updateMouseHand(e.touches[0].clientX, e.touches[0].clientY, true);
      }
    }, { passive: true });

    window.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        updateMouseHand(e.touches[0].clientX, e.touches[0].clientY, true);
      }
    }, { passive: true });

    // When mouse exits the window, clear mouse hand immediately
    window.addEventListener('mouseleave', () => {
      if (!this.isCameraActive || this.isSimulatedOnly) {
        this.simHands = [];
        if (this.onResults) {
          this.onResults([]);
        }
      }
    });
  }

  enableSimulator(state = true) {
    this.isSimulatedOnly = state;
    if (!state && this.onResults) {
      this.simHands = [];
      this.onResults([]);
    }
    return this.isSimulatedOnly;
  }
}
