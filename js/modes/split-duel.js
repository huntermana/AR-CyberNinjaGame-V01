// Cyber Ninja: Firewall Slasher - Mode 2: 1v1 Split-Screen Duel (Full Timed Competition)

import { CONFIG, MALWARE_TYPES, SAFE_PACKET_TYPES } from '../config.js';
import { FloatingPod } from '../entities/floating-pod.js';
import { Malware } from '../entities/malware.js';
import { SafePacket } from '../entities/safe-packet.js';
import { audio } from '../audio.js';
import { i18n } from '../i18n.js';
import { GestureDetector } from '../tracking/gesture-detector.js';

export class SplitDuelMode {
  constructor(game) {
    this.game = game;
    this.active = false;

    // Configurable Match Settings
    this.roundDuration = 30; // 15, 30, 60 seconds
    this.totalRounds = 3;    // 1, 3, 5 rounds
    this.currentRound = 1;

    // Player 1 (Left - Blue/Cyan)
    this.scoreP1 = 0;
    this.comboP1 = 0;
    this.maxComboP1 = 0;
    this.slashedP1 = 0;
    this.caughtP1 = 0;
    this.penaltiesP1 = 0;
    this.roundWinsP1 = 0;
    this.roundScoreP1 = 0;

    // Player 2 (Right - Red/Magenta)
    this.scoreP2 = 0;
    this.comboP2 = 0;
    this.maxComboP2 = 0;
    this.slashedP2 = 0;
    this.caughtP2 = 0;
    this.penaltiesP2 = 0;
    this.roundWinsP2 = 0;
    this.roundScoreP2 = 0;

    // State machine: 'READY_WAIT', 'COUNTDOWN', 'ROUND_PLAYING', 'ROUND_SUMMARY', 'MATCH_OVER'
    this.state = 'READY_WAIT';
    this.roundTimeLeft = 30;
    this.countdown = 3;
    this.countdownTimer = 0;
    this.summaryTimer = 0;

    // Interactive Ready Pods
    this.readyPodP1 = null;
    this.readyPodP2 = null;

    // Entities in the duel arena
    this.entitiesP1 = [];
    this.entitiesP2 = [];
    this.spawnTimerP1 = 0;
    this.spawnTimerP2 = 0;
    this.spawnInterval = 1.1;

    this.roundWinner = null;
    this.matchWinner = null;
  }

  start(roundDuration = 30, totalRounds = 3) {
    this.active = true;
    this.roundDuration = Number(roundDuration) || 30;
    this.totalRounds = Number(totalRounds) || 3;
    this.currentRound = 1;

    this.scoreP1 = 0;
    this.comboP1 = 0;
    this.maxComboP1 = 0;
    this.slashedP1 = 0;
    this.caughtP1 = 0;
    this.penaltiesP1 = 0;
    this.roundWinsP1 = 0;

    this.scoreP2 = 0;
    this.comboP2 = 0;
    this.maxComboP2 = 0;
    this.slashedP2 = 0;
    this.caughtP2 = 0;
    this.penaltiesP2 = 0;
    this.roundWinsP2 = 0;

    this.matchWinner = null;
    audio.playBGM(2); // Mode 2 Combat Darksynth BGM

    this.setupReadyPhase();
  }

  setupReadyPhase() {
    this.state = 'READY_WAIT';
    this.roundWinner = null;
    this.roundScoreP1 = 0;
    this.roundScoreP2 = 0;
    this.entitiesP1 = [];
    this.entitiesP2 = [];
    this.spawnTimerP1 = 0;
    this.spawnTimerP2 = 0;

    const midY = CONFIG.CANVAS_HEIGHT / 2 - 50;
    // Left Ready Pod (Player 1 Blue)
    this.readyPodP1 = new FloatingPod({
      id: 'p1_ready',
      x: 100,
      y: midY,
      width: 400,
      height: 120,
      label: 'READY (ยกมือ)',
      sublabel: `P1 BLUE [ROUND ${this.currentRound}/${this.totalRounds}]`,
      color: '#00e5ff',
      textColor: '#00e5ff',
      requiredDwell: 400
    });

    // Right Ready Pod (Player 2 Red)
    this.readyPodP2 = new FloatingPod({
      id: 'p2_ready',
      x: CONFIG.CANVAS_WIDTH - 500,
      y: midY,
      width: 400,
      height: 120,
      label: 'READY (ยกมือ)',
      sublabel: `P2 RED [ROUND ${this.currentRound}/${this.totalRounds}]`,
      color: '#ff0055',
      textColor: '#ff0055',
      requiredDwell: 400
    });
  }

  startCountdown() {
    this.state = 'COUNTDOWN';
    this.countdown = 3;
    this.countdownTimer = 1.0;
    audio.playCountdown(false);
  }

  startRoundPlaying() {
    this.state = 'ROUND_PLAYING';
    this.roundTimeLeft = this.roundDuration;
    this.entitiesP1 = [];
    this.entitiesP2 = [];
    this.roundScoreP1 = 0;
    this.roundScoreP2 = 0;
    this.spawnTimerP1 = 0.2; // Immediate initial spawn
    this.spawnTimerP2 = 0.2;
  }

  spawnEntityForSide(side = 'P1') {
    const isP1 = side === 'P1';
    const isSafe = Math.random() < 0.35;
    const minX = isP1 ? 80 : CONFIG.CANVAS_WIDTH / 2 + 80;
    const maxX = isP1 ? CONFIG.CANVAS_WIDTH / 2 - 80 : CONFIG.CANVAS_WIDTH - 80;
    const spawnX = Math.random() * (maxX - minX) + minX;
    const spawnY = CONFIG.CANVAS_HEIGHT + 20; // Launch upwards

    const vx = (Math.random() - 0.5) * 80;
    const vy = -(Math.random() * 80 + 440);

    if (isSafe) {
      const type = SAFE_PACKET_TYPES[Math.floor(Math.random() * SAFE_PACKET_TYPES.length)];
      const item = new SafePacket(type, spawnX, spawnY, vx, vy);
      if (isP1) this.entitiesP1.push(item);
      else this.entitiesP2.push(item);
    } else {
      const type = MALWARE_TYPES[Math.floor(Math.random() * MALWARE_TYPES.length)];
      const mal = new Malware(type, spawnX, spawnY, vx, vy);
      if (isP1) this.entitiesP1.push(mal);
      else this.entitiesP2.push(mal);
    }
  }

  endRound() {
    this.state = 'ROUND_SUMMARY';
    this.summaryTimer = 3.0;
    this.entitiesP1 = [];
    this.entitiesP2 = [];

    if (this.roundScoreP1 > this.roundScoreP2) {
      this.roundWinner = 'P1';
      this.roundWinsP1++;
      audio.playVictory();
      this.game.particles.addScreenFlash('#00e5ff', 0.5, 0.4);
    } else if (this.roundScoreP2 > this.roundScoreP1) {
      this.roundWinner = 'P2';
      this.roundWinsP2++;
      audio.playVictory();
      this.game.particles.addScreenFlash('#ff0055', 0.5, 0.4);
    } else {
      this.roundWinner = 'DRAW';
      audio.playFreeze();
    }
  }

  finishMatch() {
    this.state = 'MATCH_OVER';
    audio.playVictory();

    // Determine Grand Match Winner
    if (this.roundWinsP1 > this.roundWinsP2 || (this.roundWinsP1 === this.roundWinsP2 && this.scoreP1 > this.scoreP2)) {
      this.matchWinner = 'P1';
    } else if (this.roundWinsP2 > this.roundWinsP1 || (this.roundWinsP1 === this.roundWinsP2 && this.scoreP2 > this.scoreP1)) {
      this.matchWinner = 'P2';
    } else {
      this.matchWinner = 'DRAW';
    }

    if (this.game && this.game.onDuelComplete) {
      this.game.onDuelComplete({
        winner: this.matchWinner,
        p1: {
          score: this.scoreP1,
          roundsWon: this.roundWinsP1,
          slashed: this.slashedP1,
          caught: this.caughtP1,
          penalties: this.penaltiesP1,
          maxCombo: this.maxComboP1
        },
        p2: {
          score: this.scoreP2,
          roundsWon: this.roundWinsP2,
          slashed: this.slashedP2,
          caught: this.caughtP2,
          penalties: this.penaltiesP2,
          maxCombo: this.maxComboP2
        }
      });
    }
  }

  update(dt, detectedHands = []) {
    if (!this.active) return;

    // Split hands by arena side (x < 640 = P1 Blue, x >= 640 = P2 Red)
    const handsP1 = [];
    const handsP2 = [];
    for (const h of detectedHands) {
      if (h.tip.x < CONFIG.CANVAS_WIDTH / 2) {
        handsP1.push(h);
      } else {
        handsP2.push(h);
      }
    }

    // STATE: READY_WAIT
    if (this.state === 'READY_WAIT') {
      this.readyPodP1.update(dt, handsP1);
      this.readyPodP2.update(dt, handsP2);

      if (this.readyPodP1.isTriggered && this.readyPodP2.isTriggered) {
        this.startCountdown();
      }
      return;
    }

    // STATE: COUNTDOWN
    if (this.state === 'COUNTDOWN') {
      this.countdownTimer -= dt;
      if (this.countdownTimer <= 0) {
        this.countdown--;
        if (this.countdown > 0) {
          this.countdownTimer = 1.0;
          audio.playCountdown(false);
        } else {
          audio.playCountdown(true); // DUEL!
          this.startRoundPlaying();
        }
      }
      return;
    }

    // STATE: ROUND_SUMMARY
    if (this.state === 'ROUND_SUMMARY') {
      this.summaryTimer -= dt;
      if (this.summaryTimer <= 0) {
        if (this.currentRound < this.totalRounds) {
          this.currentRound++;
          this.setupReadyPhase();
        } else {
          this.finishMatch();
        }
      }
      return;
    }

    // STATE: ROUND_PLAYING
    if (this.state === 'ROUND_PLAYING') {
      this.roundTimeLeft -= dt;
      if (this.roundTimeLeft <= 0) {
        this.roundTimeLeft = 0;
        this.endRound();
        return;
      }

      // Spawning for P1
      this.spawnTimerP1 += dt;
      if (this.spawnTimerP1 >= this.spawnInterval) {
        this.spawnTimerP1 = 0;
        this.spawnEntityForSide('P1');
      }

      // Spawning for P2
      this.spawnTimerP2 += dt;
      if (this.spawnTimerP2 >= this.spawnInterval) {
        this.spawnTimerP2 = 0;
        this.spawnEntityForSide('P2');
      }

      // Update and check interactions for P1
      this.updateSideEntities(dt, this.entitiesP1, handsP1, 'P1');

      // Update and check interactions for P2
      this.updateSideEntities(dt, this.entitiesP2, handsP2, 'P2');
    }
  }

  updateSideEntities(dt, entities, hands, side) {
    const isP1 = side === 'P1';

    for (let i = entities.length - 1; i >= 0; i--) {
      const ent = entities[i];
      ent.update(dt);

      for (const h of hands) {
        // CATCH LOGIC (Safe packets, 5-finger open shield)
        if (ent instanceof SafePacket && !ent.isDead && h.isCatching) {
          const dist = Math.hypot(h.palm.x - ent.x, h.palm.y - ent.y);
          if (dist <= CONFIG.PALM_CATCH_RADIUS + ent.radius) {
            ent.pullTowardPalm(h.palm.x, h.palm.y, dt);
            if (dist < 58) {
              ent.isDead = true;
              const points = ent.points;
              if (isP1) {
                this.scoreP1 += points;
                this.roundScoreP1 += points;
                this.caughtP1++;
              } else {
                this.scoreP2 += points;
                this.roundScoreP2 += points;
                this.caughtP2++;
              }
              audio.playCatch();
              this.game.particles.emitSparks(ent.x, ent.y, ent.color, 24, 300);
            }
          }
        }

        // SLASH LOGIC (1-Finger Knife Blade, strictly NOT catching)
        if (h.isSlashing && !h.isCatching && h.slashSegment && !ent.isDead) {
          const seg = h.slashSegment;
          const hit = GestureDetector.segmentIntersectsCircle(
            seg.x1, seg.y1, seg.x2, seg.y2, ent.x, ent.y, ent.radius
          );

          if (hit) {
            if (ent instanceof Malware) {
              ent.isDead = true;
              audio.playSlash();
              audio.playHit();
              this.game.particles.emitSplitSlice(ent, seg.angle);

              if (isP1) {
                this.comboP1++;
                this.maxComboP1 = Math.max(this.maxComboP1, this.comboP1);
                const comboMult = Math.min(5, 1 + Math.floor(this.comboP1 / 3) * 0.5);
                const pts = Math.round(ent.points * comboMult);
                this.scoreP1 += pts;
                this.roundScoreP1 += pts;
                this.slashedP1++;
              } else {
                this.comboP2++;
                this.maxComboP2 = Math.max(this.maxComboP2, this.comboP2);
                const comboMult = Math.min(5, 1 + Math.floor(this.comboP2 / 3) * 0.5);
                const pts = Math.round(ent.points * comboMult);
                this.scoreP2 += pts;
                this.roundScoreP2 += pts;
                this.slashedP2++;
              }
            } else if (ent instanceof SafePacket) {
              // Accidental slash on safe packet! Penalty!
              ent.isDead = true;
              audio.playPenalty();
              this.game.particles.emitSplitSlice(ent, seg.angle);
              this.game.particles.addScreenFlash('#ff0055', 0.25, 0.3);

              if (isP1) {
                this.comboP1 = 0;
                this.scoreP1 = Math.max(0, this.scoreP1 - 100);
                this.roundScoreP1 = Math.max(0, this.roundScoreP1 - 100);
                this.penaltiesP1++;
              } else {
                this.comboP2 = 0;
                this.scoreP2 = Math.max(0, this.scoreP2 - 100);
                this.roundScoreP2 = Math.max(0, this.roundScoreP2 - 100);
                this.penaltiesP2++;
              }
            }
          }
        }
      }

      if (ent.isDead || ent.isOffscreen) {
        entities.splice(i, 1);
      }
    }
  }

  render(ctx) {
    if (!this.active) return;

    // 1. Center Dividing Neon Laser Barrier
    ctx.save();
    const midX = CONFIG.CANVAS_WIDTH / 2;
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.setLineDash([16, 12]);
    ctx.beginPath();
    ctx.moveTo(midX, 0);
    ctx.lineTo(midX, CONFIG.CANVAS_HEIGHT);
    ctx.stroke();

    // Dividing Laser Core
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.shadowBlur = 14;
    ctx.shadowColor = '#00f3ff';
    ctx.beginPath();
    ctx.moveTo(midX, 0);
    ctx.lineTo(midX, CONFIG.CANVAS_HEIGHT);
    ctx.stroke();
    ctx.restore();

    // 2. Top Arena HUD Header (Scores, Timer, Rounds)
    ctx.save();
    // P1 (Blue) Score & Stats
    ctx.font = '900 28px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#00e5ff';
    ctx.textAlign = 'left';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00e5ff';
    ctx.fillText(`P1 BLUE: ${this.scoreP1.toLocaleString()}`, 30, 48);

    ctx.font = 'bold 16px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`ชนะรอบ: ${this.roundWinsP1} | คอมโบ: x${this.comboP1}`, 30, 74);

    // P2 (Red) Score & Stats
    ctx.font = '900 28px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#ff0055';
    ctx.textAlign = 'right';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff0055';
    ctx.fillText(`P2 RED: ${this.scoreP2.toLocaleString()}`, CONFIG.CANVAS_WIDTH - 30, 48);

    ctx.font = 'bold 16px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`ชนะรอบ: ${this.roundWinsP2} | คอมโบ: x${this.comboP2}`, CONFIG.CANVAS_WIDTH - 30, 74);

    // Center Round & Timer Pill
    const pillW = 220;
    const pillH = 64;
    const pillX = midX - pillW / 2;
    const pillY = 16;
    ctx.fillStyle = 'rgba(9, 14, 26, 0.9)';
    ctx.strokeStyle = '#ffb703';
    ctx.lineWidth = 2;
    ctx.strokeRect(pillX, pillY, pillW, pillH);
    ctx.fillRect(pillX, pillY, pillW, pillH);

    ctx.font = 'bold 14px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#ffb703';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 0;
    ctx.fillText(`ROUND ${this.currentRound} / ${this.totalRounds}`, midX, pillY + 22);

    ctx.font = '900 28px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${Math.ceil(this.roundTimeLeft)}s`, midX, pillY + 52);
    ctx.restore();

    // 3. Render Entities
    for (const ent of this.entitiesP1) ent.render(ctx);
    for (const ent of this.entitiesP2) ent.render(ctx);

    // 4. Render State Overlays
    if (this.state === 'READY_WAIT') {
      this.readyPodP1.render(ctx);
      this.readyPodP2.render(ctx);
    }

    if (this.state === 'COUNTDOWN') {
      ctx.save();
      ctx.font = '900 110px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ffb703';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 24;
      ctx.shadowColor = '#ffb703';
      ctx.fillText(`${this.countdown}`, midX, CONFIG.CANVAS_HEIGHT / 2 + 35);
      ctx.restore();
    }

    if (this.state === 'ROUND_SUMMARY') {
      ctx.save();
      ctx.fillStyle = 'rgba(5, 8, 18, 0.85)';
      ctx.fillRect(0, CONFIG.CANVAS_HEIGHT / 2 - 100, CONFIG.CANVAS_WIDTH, 200);

      ctx.font = '900 48px "Rajdhani", "Kanit", sans-serif';
      ctx.textAlign = 'center';
      if (this.roundWinner === 'P1') {
        ctx.fillStyle = '#00e5ff';
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 20;
        ctx.fillText(`🏆 P1 (BLUE) ชนะรอบที่ ${this.currentRound}! (+1 รอบ)`, midX, CONFIG.CANVAS_HEIGHT / 2 - 10);
      } else if (this.roundWinner === 'P2') {
        ctx.fillStyle = '#ff0055';
        ctx.shadowColor = '#ff0055';
        ctx.shadowBlur = 20;
        ctx.fillText(`🏆 P2 (RED) ชนะรอบที่ ${this.currentRound}! (+1 รอบ)`, midX, CONFIG.CANVAS_HEIGHT / 2 - 10);
      } else {
        ctx.fillStyle = '#ffb703';
        ctx.shadowColor = '#ffb703';
        ctx.shadowBlur = 20;
        ctx.fillText(`เสมอในรอบที่ ${this.currentRound}! (DRAW)`, midX, CONFIG.CANVAS_HEIGHT / 2 - 10);
      }

      ctx.font = 'bold 24px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`คะแนนในรอบ: P1 (${this.roundScoreP1.toLocaleString()}) VS P2 (${this.roundScoreP2.toLocaleString()})`, midX, CONFIG.CANVAS_HEIGHT / 2 + 45);
      ctx.restore();
    }
  }
}
