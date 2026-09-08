import { CONFIG, MALWARE_TYPES, SAFE_PACKET_TYPES, QUIZ_DATABASE, DIFFICULTY_LEVELS } from '../config.js';
import { Malware } from '../entities/malware.js';
import { SafePacket } from '../entities/safe-packet.js';
import { FloatingPod } from '../entities/floating-pod.js';
import { audio } from '../audio.js';
import { i18n } from '../i18n.js';
import { GestureDetector } from '../tracking/gesture-detector.js';

export class ScoreAttackMode {
  constructor(game) {
    this.game = game;
    this.active = false;
    this.timeLeft = CONFIG.SCORE_ATTACK_DURATION;
    this.difficulty = DIFFICULTY_LEVELS[1];
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.lastHitTime = 0;
    
    this.malwareSlain = 0;
    this.safePacketsCaught = 0;
    this.penalties = 0;
    this.selectedTeam = CONFIG.TEAMS[0].id;

    this.entities = [];
    this.spawnTimer = 0;
    this.spawnInterval = 1.3; // Seconds

    // Floating Quiz State
    this.activeQuiz = null;
    this.quizPods = [];
    this.hasQuizTriggered = false;
    this.quizTimer = 0;
    this.quizMaxTime = 10;
    this.quizArmingTimer = 0;
    this.lastQuizBeepInt = 0;
  }

  start(teamId = 'alpha', difficultyLevel = 2) {
    this.active = true;
    this.timeLeft = CONFIG.SCORE_ATTACK_DURATION;
    const diffObj = DIFFICULTY_LEVELS.find(d => d.level === Number(difficultyLevel));
    this.difficulty = diffObj || DIFFICULTY_LEVELS[1];

    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.malwareSlain = 0;
    this.safePacketsCaught = 0;
    this.penalties = 0;
    this.selectedTeam = teamId;
    this.entities = [];
    this.spawnTimer = 0;
    this.spawnInterval = 1.3 * this.difficulty.spawnIntervalMult;
    this.hasQuizTriggered = false;
    this.activeQuiz = null;
    this.quizPods = [];
    this.quizTimer = 0;
    this.quizMaxTime = 10;
    this.quizArmingTimer = 0;
    this.lastQuizBeepInt = 0;

    audio.playBGM(1); // Mode 1 Upbeat Synthwave BGM
    audio.playCountdown(true);
  }

  getMultiplier() {
    if (this.combo >= 15) return 5;
    if (this.combo >= 10) return 3;
    if (this.combo >= 6) return 2;
    if (this.combo >= 3) return 1.5;
    return 1;
  }

  spawnEntity() {
    const isSafe = Math.random() < this.difficulty.safeRatio;
    const spawnX = Math.random() * (CONFIG.CANVAS_WIDTH - 240) + 120;
    const spawnY = CONFIG.CANVAS_HEIGHT + 30; // Launch upwards from bottom
    const speedMult = this.difficulty.speedMult;
    const vx = ((CONFIG.CANVAS_WIDTH / 2 - spawnX) * 0.35 + (Math.random() - 0.5) * 120) * speedMult;
    const vy = -(Math.random() * 140 + 440) * speedMult; // Launch velocity

    if (isSafe) {
      const type = SAFE_PACKET_TYPES[Math.floor(Math.random() * SAFE_PACKET_TYPES.length)];
      this.entities.push(new SafePacket(type, spawnX, spawnY, vx * 0.8, vy * 0.85));
    } else {
      const type = MALWARE_TYPES[Math.floor(Math.random() * MALWARE_TYPES.length)];
      this.entities.push(new Malware(type, spawnX, spawnY, vx, vy));
    }
  }

  triggerQuiz() {
    const q = QUIZ_DATABASE[Math.floor(Math.random() * QUIZ_DATABASE.length)];
    this.activeQuiz = q;

    // Difficulty-based countdown:
    // Level 1: 10s, Level 2: 9s, Level 3: 8s, Level 4: 7s, Level 5: 5s
    const level = this.difficulty && this.difficulty.level ? this.difficulty.level : 2;
    const timeLimits = { 1: 10.0, 2: 9.0, 3: 8.0, 4: 7.0, 5: 5.0 };
    this.quizMaxTime = timeLimits[level] || 9.0;
    this.quizTimer = this.quizMaxTime;
    this.lastQuizBeepInt = Math.ceil(this.quizTimer);

    // ANTI-MISCLICK GUARD:
    // 1. Reset all tracking states so an already-extended hand doesn't instantly misclick
    if (this.game) {
      this.game.detectedHands = [];
      this.game.trailP1?.clear();
      this.game.trailP2?.clear();
      this.game.gestureDetector?.reset();
      this.game.lastHandTimestamp = performance.now();
    }

    // 2. Arming grace delay of 1.0 second: during this second, pods are locked and disarmed
    this.quizArmingTimer = 1.0;

    audio.playFreeze();
    this.game.particles.addScreenFlash('#00f3ff', 0.5, 0.4);

    // Create 2 large, spacious choice cards (A Left, B Right)
    const podW = 510;
    const podH = 160;
    const podY = 475;

    this.quizPods = [
      new FloatingPod({
        id: 'podA',
        x: 90,
        y: podY,
        width: podW,
        height: podH,
        fontSize: 22,
        sublabelFontSize: 14,
        label: i18n.lang === 'th' ? `A) ${q.optionA.textTH}` : `A) ${q.optionA.textEN}`,
        sublabel: i18n.lang === 'th' ? '✋ กางมือค้าง หรือ 🗡️ ฟันดาบเลือกข้อ A' : '✋ Open Palm Hold or 🗡️ Slash A',
        color: '#00e5ff',
        isArmed: false,
        requiredDwell: 550,
        onSelect: () => this.handleQuizAnswer('A')
      }),
      new FloatingPod({
        id: 'podB',
        x: CONFIG.CANVAS_WIDTH - 90 - podW,
        y: podY,
        width: podW,
        height: podH,
        fontSize: 22,
        sublabelFontSize: 14,
        label: i18n.lang === 'th' ? `B) ${q.optionB.textTH}` : `B) ${q.optionB.textEN}`,
        sublabel: i18n.lang === 'th' ? '✋ กางมือค้าง หรือ 🗡️ ฟันดาบเลือกข้อ B' : '✋ Open Palm Hold or 🗡️ Slash B',
        color: '#ff0055',
        isArmed: false,
        requiredDwell: 550,
        onSelect: () => this.handleQuizAnswer('B')
      })
    ];
  }

  handleQuizAnswer(choice) {
    if (!this.activeQuiz) return;
    const isA = choice === 'A';
    const isCorrect = (isA && this.activeQuiz.optionA.isCorrect) || (!isA && this.activeQuiz.optionB.isCorrect);

    if (isCorrect) {
      this.score += 250 * this.getMultiplier();
      this.combo += 2;
      this.game.particles.addScreenFlash('#00ff66', 0.5, 0.4);
      this.game.particles.emitSparks(CONFIG.CANVAS_WIDTH / 2, 340, '#00ff66', 40, 450);
      audio.playCatch();
      audio.playVictory();
    } else {
      this.score = Math.max(0, this.score - 100);
      this.combo = 0;
      this.game.particles.addScreenFlash('#ff0055', 0.5, 0.4);
      audio.playPenalty();
    }

    this.activeQuiz = null;
    this.quizPods = [];
  }

  handleQuizTimeout() {
    if (!this.activeQuiz) return;
    this.score = Math.max(0, this.score - 100);
    this.combo = 0;
    this.game.particles.addScreenFlash('#ff0055', 0.5, 0.5);
    audio.playPenalty();

    this.activeQuiz = null;
    this.quizPods = [];
  }

  update(dt, detectedHands = []) {
    if (!this.active) return;

    // IF QUIZ IS ACTIVE:
    // GAME CLOCK AND FALLING ENTITIES ARE 100% FROZEN!
    if (this.activeQuiz) {
      if (this.quizArmingTimer > 0) {
        this.quizArmingTimer -= dt;
        if (this.quizArmingTimer <= 0) {
          this.quizArmingTimer = 0;
          for (const pod of this.quizPods) {
            pod.setArmed(true);
          }
        }
      } else {
        this.quizTimer -= dt;

        // Beep on each integer second tick
        const currentInt = Math.ceil(this.quizTimer);
        if (currentInt < this.lastQuizBeepInt && currentInt > 0) {
          this.lastQuizBeepInt = currentInt;
          audio.playCountdown(false);
        }

        if (this.quizTimer <= 0) {
          this.quizTimer = 0;
          this.handleQuizTimeout();
          return;
        }
      }

      for (const pod of this.quizPods) {
        pod.update(dt, detectedHands);
      }
      return; // Freeze rest of the game loop during quiz
    }

    // REGULAR GAME LOOP (when quiz is not active):
    // Timer countdown
    this.timeLeft -= dt;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.endGame();
      return;
    }

    // Combo timeout check
    if (this.combo > 0 && (performance.now() - this.lastHitTime) > CONFIG.COMBO_TIMEOUT) {
      this.combo = 0;
    }

    // Quiz trigger at 30 seconds mark
    if (!this.hasQuizTriggered && this.timeLeft <= 30) {
      this.hasQuizTriggered = true;
      this.triggerQuiz();
      return;
    }

    // Spawning logic
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnEntity();
      // Increase spawn rate as time runs down
      this.spawnInterval = Math.max(0.7, 1.3 - (60 - this.timeLeft) * 0.01);
    }

    // Update entities
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const ent = this.entities[i];
      ent.update(dt);

      // Check interactions with hands
      for (const h of detectedHands) {
        // A. CATCH LOGIC (Safe Packets + Open Palm)
        if (ent instanceof SafePacket && !ent.isDead) {
          if (h.isCatching) {
            const dist = Math.hypot(h.palm.x - ent.x, h.palm.y - ent.y);
            if (dist <= CONFIG.PALM_CATCH_RADIUS + ent.radius) {
              ent.pullTowardPalm(h.palm.x, h.palm.y, dt);
              if (dist < 58) {
                // Caught!
                ent.isDead = true;
                ent.isCaught = true;
                this.safePacketsCaught++;
                this.score += ent.points * this.getMultiplier();
                this.combo++;
                this.maxCombo = Math.max(this.maxCombo, this.combo);
                this.lastHitTime = performance.now();
                
                audio.playCatch();
                this.game.particles.emitSparks(ent.x, ent.y, ent.color, 24, 300);
                this.game.particles.addScreenFlash(ent.color, 0.15, 0.2);
              }
            }
          }
        }

        // B. SLASH LOGIC (Malware OR Accidental Knife-Hand Slash on Safe Packet)
        // Strictly ignore any slash if the hand is in Open Palm Catch mode
        if (h.isSlashing && !h.isCatching && h.slashSegment && !ent.isDead) {
          const seg = h.slashSegment;
          const hit = GestureDetector.segmentIntersectsCircle(
            seg.x1, seg.y1, seg.x2, seg.y2, ent.x, ent.y, ent.radius
          );

          if (hit) {
            if (ent instanceof Malware) {
              // Slashed malware!
              ent.isDead = true;
              ent.isSlashed = true;
              this.malwareSlain++;
              this.score += ent.points * this.getMultiplier();
              this.combo++;
              this.maxCombo = Math.max(this.maxCombo, this.combo);
              this.lastHitTime = performance.now();

              audio.playSlash();
              audio.playHit();
              this.game.particles.emitSplitSlice(ent, seg.angle);
              this.game.particles.emitSparks(ent.x, ent.y, ent.color, 20, 320);
            } else if (ent instanceof SafePacket) {
              // ACCIDENTAL KNIFE-HAND SLASH OF SAFE DATA -> PENALTY!
              ent.isDead = true;
              ent.isSlashed = true;
              this.penalties++;
              this.score = Math.max(0, this.score - ent.penaltyPoints);
              this.combo = 0; // Break combo

              audio.playPenalty();
              this.game.particles.emitSplitSlice(ent, seg.angle);
              this.game.particles.emitSparks(ent.x, ent.y, '#ff0055', 24, 360);
              this.game.particles.addScreenFlash('#ff0055', 0.25, 0.35);
            }
          }
        }
      }

      if (ent.isDead) {
        this.entities.splice(i, 1);
      }
    }
  }

  render(ctx) {
    if (!this.active) return;

    // Render falling entities
    for (const ent of this.entities) {
      ent.render(ctx);
    }

    // Render Quiz if active
    if (this.activeQuiz) {
      ctx.save();

      // 1. Full-screen Dark Cyber Fade
      ctx.fillStyle = 'rgba(2, 6, 18, 0.95)';
      ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

      // Neon Cyber Frame & Corner Tech Accents
      ctx.strokeStyle = '#00f3ff';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#00f3ff';
      ctx.strokeRect(30, 20, CONFIG.CANVAS_WIDTH - 60, CONFIG.CANVAS_HEIGHT - 40);

      const corners = [
        [30, 20], [CONFIG.CANVAS_WIDTH - 30, 20],
        [30, CONFIG.CANVAS_HEIGHT - 20], [CONFIG.CANVAS_WIDTH - 30, CONFIG.CANVAS_HEIGHT - 20]
      ];
      for (const [cx, cy] of corners) {
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(cx - 8, cy - 8, 16, 16);
      }

      // 2. Alert Header
      ctx.textAlign = 'center';
      ctx.font = '900 28px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ffb703';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ffb703';
      ctx.fillText('⚠️ CYBER SECURITY QUIZ: ภารกิจตอบคำถามกู้เซิร์ฟเวอร์ ⚠️', CONFIG.CANVAS_WIDTH / 2, 64);

      // 3. Difficulty Badge & Countdown Timer Gauge
      const timerRatio = Math.max(0, this.quizTimer / this.quizMaxTime);
      const timerColor = this.quizTimer <= 3 ? '#ff0055' : (this.quizTimer <= 5 ? '#ffb703' : '#00ff66');

      const barW = 680;
      const barH = 14;
      const barX = (CONFIG.CANVAS_WIDTH - barW) / 2;
      const barY = 86;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, barH, 7);
      ctx.fill();

      ctx.fillStyle = timerColor;
      ctx.shadowBlur = 12;
      ctx.shadowColor = timerColor;
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW * timerRatio, barH, 7);
      ctx.fill();

      // Digital Timer Label
      ctx.font = 'bold 22px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = timerColor;
      ctx.shadowBlur = 8;
      ctx.shadowColor = timerColor;
      const timerStr = this.quizArmingTimer > 0
        ? `⚡ ระบบกำลังเตรียมคำถาม... (ปลดล็อกใน ${(this.quizArmingTimer).toFixed(1)}s)`
        : `⏱️ เวลานับถอยหลัง: ${this.quizTimer.toFixed(1)} วินาที [${this.difficulty.nameTH}]`;
      ctx.fillText(timerStr, CONFIG.CANVAS_WIDTH / 2, 130);

      // 4. Large Question Box with High-Contrast Typography
      const qBoxX = 70;
      const qBoxY = 150;
      const qBoxW = CONFIG.CANVAS_WIDTH - 140;
      const qBoxH = 260;

      ctx.fillStyle = 'rgba(8, 16, 32, 0.90)';
      ctx.strokeStyle = '#00f3ff';
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#00e5ff';
      ctx.beginPath();
      ctx.roundRect(qBoxX, qBoxY, qBoxW, qBoxH, 16);
      ctx.fill();
      ctx.stroke();

      // Question Category Tag
      ctx.font = 'bold 15px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#00f3ff';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#00f3ff';
      ctx.fillText('QUESTION / สถานการณ์ภัยคุกคามไซเบอร์', CONFIG.CANVAS_WIDTH / 2, qBoxY + 34);

      // Question Text with 30px bold font
      const qText = i18n.lang === 'th' ? this.activeQuiz.questionTH : this.activeQuiz.questionEN;
      ctx.font = 'bold 30px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#00e5ff';

      // Smart wrapping helper
      const wrapText = (text, maxPx) => {
        const chunks = text.includes(' ') ? text.split(' ') : text.match(/.{1,28}/g) || [text];
        const res = [];
        let cur = '';
        for (const c of chunks) {
          const test = cur ? (text.includes(' ') ? cur + ' ' + c : cur + c) : c;
          if (ctx.measureText(test).width > maxPx && cur) {
            res.push(cur);
            cur = c;
          } else {
            cur = test;
          }
        }
        if (cur) res.push(cur);
        return res;
      };

      const lines = wrapText(qText, qBoxW - 80);
      const totalTextH = lines.length * 42;
      const textStartY = qBoxY + 55 + (qBoxH - 75 - totalTextH) / 2 + 28;
      lines.forEach((line, idx) => {
        ctx.fillText(line, CONFIG.CANVAS_WIDTH / 2, textStartY + idx * 42);
      });

      // 5. Instruction banner below question box
      ctx.font = 'bold 16px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = this.quizArmingTimer > 0 ? '#ffb703' : '#00ff66';
      ctx.shadowBlur = 8;
      ctx.shadowColor = ctx.fillStyle;
      const instruct = this.quizArmingTimer > 0
        ? '🔒 ป้องกันการแตะผิดพลาด: ตัวเลือกกำลังเตรียมความพร้อม กรุณาอ่านโจทย์ก่อนตอบ'
        : '✋ วิธีตอบ: กางมือ 5 นิ้วค้างไว้ที่ตัวเลือก 0.5 วินาที หรือ 🗡️ ใช้นิ้วชี้ฟันดาบเลเซอร์';
      ctx.fillText(instruct, CONFIG.CANVAS_WIDTH / 2, qBoxY + qBoxH + 34);

      // 6. Render Choice Pods
      for (const pod of this.quizPods) {
        pod.render(ctx);
      }

      ctx.restore();
    }
  }

  endGame() {
    this.active = false;
    audio.playVictory();
    this.game.onModeComplete({
      mode: 'score-attack',
      score: this.score,
      maxCombo: this.maxCombo,
      malwareSlain: this.malwareSlain,
      safePacketsCaught: this.safePacketsCaught,
      penalties: this.penalties,
      teamId: this.selectedTeam
    });
  }
}
