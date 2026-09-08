// Cyber Ninja: Firewall Slasher - Mode 3: Co-op Boss Fight (4-10 Runners vs 5 Progressive Cyber Bosses)

import { CONFIG, MALWARE_TYPES, SAFE_PACKET_TYPES, DIFFICULTY_LEVELS } from '../config.js';
import { Malware } from '../entities/malware.js';
import { SafePacket } from '../entities/safe-packet.js';
import { audio } from '../audio.js';
import { i18n } from '../i18n.js';
import { GestureDetector } from '../tracking/gesture-detector.js';
import { assetManager } from '../asset-manager.js';

// 5 Boss Progression Catalog mapped to Difficulty Levels (1-5)
export const BOSS_CATALOG = {
  1: {
    id: 'worm_core',
    assetKey: 'boss_level1',
    nameTH: 'เวิร์มไวรัสดิจิทัล (Matrix Worm Core)',
    nameEN: 'Matrix Worm Core',
    color: '#00ff66',
    title: 'LEVEL 1 BOSS - NOVICE'
  },
  2: {
    id: 'apocalypse_daemon',
    assetKey: 'boss_level2',
    nameTH: 'ปีศาจไซเบอร์ (Apocalypse Daemon)',
    nameEN: 'Apocalypse Daemon',
    color: '#ff0055',
    title: 'LEVEL 2 BOSS - EXPERIENCED'
  },
  3: {
    id: 'quantum_spider',
    assetKey: 'boss_level3',
    nameTH: 'พญาแมงมุมควอนตัม (Quantum Spider Overlord)',
    nameEN: 'Quantum Spider Overlord',
    color: '#b026ff',
    title: 'LEVEL 3 BOSS - SKILLED'
  },
  4: {
    id: 'neon_hydra',
    assetKey: 'boss_level4',
    nameTH: 'มังกรไฮดราเลเวียธาน (Neon Hydra Leviathan)',
    nameEN: 'Neon Hydra Leviathan',
    color: '#00f3ff',
    title: 'LEVEL 4 BOSS - EXPERT'
  },
  5: {
    id: 'zero_day',
    assetKey: 'boss_level5',
    nameTH: 'จอมราชันย์ซีโร่เดย์ (Zero-Day Sovereign)',
    nameEN: 'Zero-Day Sovereign',
    color: '#ffb703',
    title: 'LEVEL 5 BOSS - BLADE MASTER'
  }
};

export class FirewallRelayMode {
  constructor(game) {
    this.game = game;
    this.active = false;

    // Configurable Settings
    this.numRunners = 4; // 4 to 10
    this.durationPerRunner = 15; // 15, 20, 30s
    this.difficulty = DIFFICULTY_LEVELS[1]; // Default: Level 2
    this.bossData = BOSS_CATALOG[2];
    this.currentRunner = 1;
    this.runnerTimeLeft = 15;

    // Boss Attributes
    this.bossMaxHp = 600;
    this.bossHp = 600;
    this.bossHurtTimer = 0;
    this.bossHoverTime = 0;
    this.bossShakeIntensity = 0;
    this.bossShakeDuration = 0;
    this.bossShakeIntensity = 0;
    this.bossShakeDuration = 0;

    // Player Ultimate Charge (Charged by catching safe items with 5 fingers)
    this.ultimateCharge = 0; // 0 to 100%
    this.isUltimateReady = false;
    this.ultimateHoldTimer = 0; // Needs 3.0s continuous open palm dwell
    this.ultimateIconPos = { x: CONFIG.CANVAS_WIDTH / 2, y: 440, radius: 56 };

    // First-Time Ultimate Tutorial Pause
    this.hasTaughtUltimate = false;
    this.isFirstUltimateTutorialActive = false;
    this.tutorialPulseTimer = 0;

    // Runner Switch Freeze & Countdown
    this.isSwitchCountdown = false;
    this.switchCountdownTime = 0;
    this.nextRunner = 1;
    this.lastBeepInt = -1;

    // Mission Stats
    this.totalMalwareSlain = 0;
    this.totalSafeCaught = 0;
    this.ultimatesFired = 0;
    this.teamScore = 0;

    this.entities = [];
    this.spawnTimer = 0;
    this.spawnInterval = 0.95;

    this.isSwitchWarning = false;
    this.switchBannerTimer = 0;
    this.isGameOver = false;
    this.isVictory = false;
  }

  start(numRunners = 4, durationPerRunner = 15, difficultyLevel = 2) {
    this.active = true;
    this.numRunners = Math.max(4, Math.min(10, Number(numRunners) || 4));
    this.durationPerRunner = Number(durationPerRunner) || 15;
    
    // Select difficulty and corresponding boss
    const diffObj = DIFFICULTY_LEVELS.find(d => d.level === Number(difficultyLevel));
    this.difficulty = diffObj || DIFFICULTY_LEVELS[1];
    this.bossData = BOSS_CATALOG[this.difficulty.level] || BOSS_CATALOG[2];

    this.currentRunner = 1;
    this.runnerTimeLeft = this.durationPerRunner;

    // Balanced Boss HP: Scaled proportionally by runners and difficulty
    const baseHpPerRunner = 140 * this.difficulty.bossHpMult;
    this.bossMaxHp = Math.round(this.numRunners * baseHpPerRunner);
    this.bossHp = this.bossMaxHp;
    this.bossHurtTimer = 0;
    this.bossHoverTime = 0;

    this.ultimateCharge = 0;
    this.isUltimateReady = false;
    this.ultimateHoldTimer = 0;

    this.hasTaughtUltimate = false;
    this.isFirstUltimateTutorialActive = false;
    this.tutorialPulseTimer = 0;

    this.isSwitchCountdown = false;
    this.switchCountdownTime = 0;
    this.nextRunner = 1;
    this.lastBeepInt = -1;

    this.totalMalwareSlain = 0;
    this.totalSafeCaught = 0;
    this.ultimatesFired = 0;
    this.teamScore = 0;

    this.entities = [];
    this.spawnTimer = 0;
    this.spawnInterval = 0.95 * this.difficulty.spawnIntervalMult;

    this.isSwitchWarning = false;
    this.switchBannerTimer = 0;
    this.isGameOver = false;
    this.isVictory = false;

    audio.playBGM(3); // Mode 3 Epic Boss Fight Theme
  }

  triggerSwitchCountdown() {
    this.isSwitchCountdown = true;
    this.switchCountdownTime = 5.0;
    this.lastBeepInt = 6;
    this.nextRunner = this.currentRunner + 1;
    audio.playFreeze();
    this.game.particles.addScreenFlash('#ff0055', 0.6, 0.5);
  }

  spawnEntity() {
    const isSafe = Math.random() < this.difficulty.safeRatio;
    const spawnX = Math.random() * (CONFIG.CANVAS_WIDTH - 240) + 120;
    const spawnY = -20;
    const speedMult = this.difficulty.speedMult;
    const vx = (Math.random() - 0.5) * (100 * speedMult);
    const vy = (Math.random() * 80 + 170) * speedMult;

    if (isSafe) {
      const type = SAFE_PACKET_TYPES[Math.floor(Math.random() * SAFE_PACKET_TYPES.length)];
      const packet = new SafePacket(type, spawnX, spawnY, vx, vy);
      packet.gravity = 40;
      this.entities.push(packet);
    } else {
      const type = MALWARE_TYPES[Math.floor(Math.random() * MALWARE_TYPES.length)];
      const mal = new Malware(type, spawnX, spawnY, vx, vy);
      mal.gravity = 60;
      this.entities.push(mal);
    }
  }

  fireUltimateAttack() {
    this.ultimatesFired++;
    this.ultimateCharge = 0;
    this.isUltimateReady = false;
    this.ultimateHoldTimer = 0;

    // Massive Damage: 35% of Boss Max HP!
    const ultimateDamage = Math.max(120, Math.round(this.bossMaxHp * 0.35));
    this.bossHp = Math.max(0, this.bossHp - ultimateDamage);
    this.bossHurtTimer = 0.95;
    this.teamScore += 1000;

    // VIOLENT BOSS SCREEN SHAKE on Ultimate Blast Impact!
    this.bossShakeIntensity = 38;
    this.bossShakeDuration = 1.05;

    // Booming Ultimate Sound SFX
    audio.playUltimateBlast();

    // Epic Visual VFX: Screen flash, massive lightning beams up to the boss!
    this.game.particles.addScreenFlash('#ffffff', 0.7, 0.5);
    this.game.particles.emitSparks(CONFIG.CANVAS_WIDTH / 2, 80, this.bossData.color || '#ff0055', 60, 550);
    this.game.particles.emitSparks(CONFIG.CANVAS_WIDTH / 2, 80, '#00f3ff', 60, 550);

    if (this.bossHp <= 0) {
      this.handleBossDefeated();
    }
  }

  handleBossDefeated() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.isVictory = true;
    this.entities = [];

    audio.playVictory();
    this.game.particles.addScreenFlash('#00ff66', 0.8, 0.6);
    this.game.particles.emitSparks(CONFIG.CANVAS_WIDTH / 2, 100, '#ffb703', 80, 600);

    if (this.game && this.game.onBossFightComplete) {
      this.game.onBossFightComplete({
        victory: true,
        score: this.teamScore,
        bossHp: 0,
        bossMaxHp: this.bossMaxHp,
        malwareSlain: this.totalMalwareSlain,
        safeCaught: this.totalSafeCaught,
        ultimatesFired: this.ultimatesFired,
        runners: this.numRunners,
        difficulty: this.difficulty.nameTH,
        bossName: this.bossData.nameTH
      });
    }
  }

  handleMissionFailed() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.isVictory = false;
    audio.playPenalty();

    if (this.game && this.game.onBossFightComplete) {
      this.game.onBossFightComplete({
        victory: false,
        score: this.teamScore,
        bossHp: this.bossHp,
        bossMaxHp: this.bossMaxHp,
        malwareSlain: this.totalMalwareSlain,
        safeCaught: this.totalSafeCaught,
        ultimatesFired: this.ultimatesFired,
        runners: this.numRunners,
        difficulty: this.difficulty.nameTH,
        bossName: this.bossData.nameTH
      });
    }
  }

  update(dt, detectedHands = []) {
    if (!this.active || this.isGameOver) return;

    // =========================================================================
    // 1. RUNNER SWITCH COUNTDOWN STATE (5-4-3-2-1-GO! with complete game pause)
    // =========================================================================
    if (this.isSwitchCountdown) {
      this.switchCountdownTime -= dt;
      const currentInt = Math.ceil(this.switchCountdownTime);
      if (currentInt > 0 && currentInt !== this.lastBeepInt && currentInt <= 5) {
        this.lastBeepInt = currentInt;
        audio.playCountdown(false); // 5, 4, 3, 2, 1 Electronic Beeps
      }

      if (this.switchCountdownTime <= 0) {
        // Countdown finished! GO!
        audio.playCountdown(true); // Final high beep
        audio.playWhistle();       // Whistle
        this.isSwitchCountdown = false;
        this.currentRunner = this.nextRunner;
        this.runnerTimeLeft = this.durationPerRunner;
        this.isSwitchWarning = false;
        this.switchBannerTimer = 1.5;
        this.game.particles.addScreenFlash('#00f3ff', 0.5, 0.4);
      }
      return; // CRITICAL: Stop game clock, entity movement, and spawning while switching!
    }

    // =========================================================================
    // 2. FIRST-TIME ULTIMATE TUTORIAL PAUSE STATE (Practice holding open palm)
    // =========================================================================
    if (this.isFirstUltimateTutorialActive) {
      this.tutorialPulseTimer += dt;

      // Allow player to practice dwelling open hand over the ultimate icon
      let isHoldingOverIcon = false;
      for (const h of detectedHands) {
        if (h.isCatching) {
          const dist = Math.hypot(h.palm.x - this.ultimateIconPos.x, h.palm.y - this.ultimateIconPos.y);
          if (dist <= this.ultimateIconPos.radius + CONFIG.PALM_CATCH_RADIUS * 0.7) {
            isHoldingOverIcon = true;
            break;
          }
        }
      }

      if (isHoldingOverIcon) {
        this.ultimateHoldTimer += dt;
        if (Math.random() < 0.4) {
          this.game.particles.emitSparks(this.ultimateIconPos.x, this.ultimateIconPos.y, '#00f3ff', 4, 140);
        }
        if (this.ultimateHoldTimer >= 3.0) {
          this.isFirstUltimateTutorialActive = false;
          this.fireUltimateAttack();
          return;
        }
      } else {
        this.ultimateHoldTimer = Math.max(0, this.ultimateHoldTimer - dt * 1.5);
      }
      return; // CRITICAL: Freeze game clock, spawning, and entity updates during tutorial practice!
    }

    // =========================================================================
    // 3. REGULAR GAMEPLAY LOOP
    // =========================================================================
    this.bossHoverTime += dt;
    if (this.bossHurtTimer > 0) this.bossHurtTimer -= dt;
    if (this.bossShakeDuration > 0) {
      this.bossShakeDuration -= dt;
      this.bossShakeIntensity = Math.max(0, this.bossShakeIntensity - dt * 32);
    }
    if (this.switchBannerTimer > 0) this.switchBannerTimer -= dt;

    // Runner countdown timer
    this.runnerTimeLeft -= dt;
    if (this.runnerTimeLeft <= 3.2 && !this.isSwitchWarning) {
      this.isSwitchWarning = true;
      audio.playWhistle();
    }

    if (this.runnerTimeLeft <= 0) {
      if (this.currentRunner < this.numRunners) {
        this.triggerSwitchCountdown();
        return;
      } else {
        // All runners have completed their turns! Check result
        if (this.bossHp > 0) {
          this.handleMissionFailed();
        } else {
          this.handleBossDefeated();
        }
        return;
      }
    }

    // Spawn entities
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this.spawnEntity();
    }

    // Ultimate Attack Readiness & First-Time Tutorial Trigger
    this.isUltimateReady = this.ultimateCharge >= 100;
    if (this.isUltimateReady && !this.hasTaughtUltimate) {
      this.isFirstUltimateTutorialActive = true;
      this.hasTaughtUltimate = true;
      this.ultimateHoldTimer = 0;
      audio.playCatch();
      return;
    }

    // Regular ultimate holding logic (for subsequent charges)
    if (this.isUltimateReady) {
      let isHoldingOverIcon = false;
      for (const h of detectedHands) {
        if (h.isCatching) {
          const dist = Math.hypot(h.palm.x - this.ultimateIconPos.x, h.palm.y - this.ultimateIconPos.y);
          if (dist <= this.ultimateIconPos.radius + CONFIG.PALM_CATCH_RADIUS * 0.7) {
            isHoldingOverIcon = true;
            break;
          }
        }
      }

      if (isHoldingOverIcon) {
        this.ultimateHoldTimer += dt;
        if (Math.random() < 0.3) {
          this.game.particles.emitSparks(this.ultimateIconPos.x, this.ultimateIconPos.y, '#00f3ff', 2, 80);
        }
        if (this.ultimateHoldTimer >= 3.0) {
          this.fireUltimateAttack();
          return;
        }
      } else {
        this.ultimateHoldTimer = Math.max(0, this.ultimateHoldTimer - dt * 1.5);
      }
    }

    // Update Entities & Interactivity
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const ent = this.entities[i];
      ent.update(dt);

      for (const h of detectedHands) {
        // CATCH LOGIC (Safe Packets, 5-Finger Open Shield)
        if (ent instanceof SafePacket && !ent.isDead && h.isCatching) {
          const dist = Math.hypot(h.palm.x - ent.x, h.palm.y - ent.y);
          if (dist <= CONFIG.PALM_CATCH_RADIUS + ent.radius) {
            ent.pullTowardPalm(h.palm.x, h.palm.y, dt);
            if (dist < 58) {
              ent.isDead = true;
              this.totalSafeCaught++;
              this.teamScore += ent.points;
              
              // Charge ultimate gauge: +25% per safe packet
              this.ultimateCharge = Math.min(100, this.ultimateCharge + 25);
              if (this.ultimateCharge >= 100 && !this.hasTaughtUltimate) {
                this.isFirstUltimateTutorialActive = true;
                this.hasTaughtUltimate = true;
                this.ultimateHoldTimer = 0;
                audio.playCatch();
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
              this.totalMalwareSlain++;
              this.teamScore += ent.points;

              // Reduce Boss HP by 20 on successful malware slash!
              const dmg = 20;
              this.bossHp = Math.max(0, this.bossHp - dmg);
              this.bossHurtTimer = 0.25;
              this.bossShakeIntensity = Math.max(this.bossShakeIntensity, 9);
              this.bossShakeDuration = Math.max(this.bossShakeDuration, 0.25);

              audio.playSlash();
              audio.playHit();
              this.game.particles.emitSplitSlice(ent, seg.angle);

              // Sparks fly up towards boss
              this.game.particles.emitSparks(ent.x, ent.y, ent.color, 20, 320);

              if (this.bossHp <= 0) {
                this.handleBossDefeated();
                return;
              }
            } else if (ent instanceof SafePacket) {
              // Accidental slash on safe packet
              ent.isDead = true;
              this.teamScore = Math.max(0, this.teamScore - 100);
              audio.playPenalty();
              this.game.particles.emitSplitSlice(ent, seg.angle);
              this.game.particles.addScreenFlash('#ff0055', 0.25, 0.3);
            }
          }
        }
      }

      if (ent.isDead || ent.isOffscreen) {
        this.entities.splice(i, 1);
      }
    }
  }

  render(ctx) {
    if (!this.active) return;

    // 1. Boss Monster at the Top Edge
    ctx.save();
    const bossKey = this.bossData ? this.bossData.assetKey : 'boss_monster';
    const bossImg = assetManager.getImage(bossKey) || assetManager.getImage('boss_monster');
    const bossW = 440;
    const bossH = 130;

    // Boss shake displacement on hit/ultimate blast
    let shakeX = 0;
    let shakeY = 0;
    if (this.bossShakeDuration > 0 && this.bossShakeIntensity > 0) {
      shakeX = (Math.random() - 0.5) * this.bossShakeIntensity * 2;
      shakeY = (Math.random() - 0.5) * this.bossShakeIntensity * 1.6;
    }

    const bossX = CONFIG.CANVAS_WIDTH / 2 - bossW / 2 + shakeX;
    const hoverOffset = Math.sin(this.bossHoverTime * 2.5) * 5;
    const bossY = -10 + hoverOffset + shakeY;

    if (bossImg && bossImg.complete && bossImg.naturalWidth > 0) {
      // Glow and render image
      ctx.shadowBlur = this.bossHurtTimer > 0 ? 28 : 16;
      ctx.shadowColor = this.bossHurtTimer > 0 ? '#ff0055' : (this.bossData.color || '#ff0000');
      ctx.drawImage(bossImg, bossX, bossY, bossW, bossH);
    } else {
      // Procedural fallback boss daemon head
      ctx.fillStyle = this.bossHurtTimer > 0 ? '#ff0055' : '#14050d';
      ctx.strokeStyle = this.bossData.color || '#ff0055';
      ctx.lineWidth = 3;
      ctx.strokeRect(bossX, bossY, bossW, bossH);
      ctx.fillRect(bossX, bossY, bossW, bossH);

      ctx.font = '900 24px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(`👾 ${this.bossData.nameEN}`, CONFIG.CANVAS_WIDTH / 2, bossY + 70);
    }

    if (this.bossHurtTimer > 0) {
      // Red flash overlay on hit
      ctx.fillStyle = 'rgba(255, 0, 85, 0.4)';
      ctx.fillRect(bossX, bossY, bossW, bossH);
    }
    ctx.restore();

    // 2. Boss HP Bar (Below Boss Image)
    ctx.save();
    const barW = 540;
    const barH = 22;
    let barShakeX = 0, barShakeY = 0;
    if (this.bossShakeDuration > 0 && this.bossShakeIntensity > 0) {
      barShakeX = (Math.random() - 0.5) * this.bossShakeIntensity * 0.8;
      barShakeY = (Math.random() - 0.5) * this.bossShakeIntensity * 0.6;
    }
    const barX = CONFIG.CANVAS_WIDTH / 2 - barW / 2 + barShakeX;
    const barY = 126 + barShakeY;

    ctx.fillStyle = 'rgba(10, 15, 25, 0.9)';
    ctx.strokeStyle = this.bossData.color || '#ff0055';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barW, barH);
    ctx.fillRect(barX, barY, barW, barH);

    const hpRatio = Math.max(0, Math.min(1, this.bossHp / this.bossMaxHp));
    const hpColor = hpRatio > 0.5 ? (this.bossData.color || '#ff0055') : (hpRatio > 0.2 ? '#ffb703' : '#ef4444');
    ctx.fillStyle = hpColor;
    ctx.shadowBlur = 12;
    ctx.shadowColor = hpColor;
    ctx.fillRect(barX + 2, barY + 2, (barW - 4) * hpRatio, barH - 4);

    ctx.font = 'bold 13px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#000000';
    ctx.fillText(`👾 ${this.bossData.nameTH}: ${Math.round(this.bossHp)} / ${this.bossMaxHp} (${Math.round(hpRatio * 100)}%)`, CONFIG.CANVAS_WIDTH / 2, barY + 16);
    ctx.restore();

    // 3. Runner Status (Top-Left HUD with NO overlap!)
    ctx.save();
    const hudBoxW = 230;
    const hudBoxH = 76;
    const hudBoxX = 24;
    const hudBoxY = 24;

    ctx.fillStyle = 'rgba(9, 14, 26, 0.85)';
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(hudBoxX, hudBoxY, hudBoxW, hudBoxH);
    ctx.fillRect(hudBoxX, hudBoxY, hudBoxW, hudBoxH);

    ctx.font = '900 18px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#00e5ff';
    ctx.textAlign = 'left';
    ctx.fillText(`🏃 คนที่ ${this.currentRunner} / ${this.numRunners}`, hudBoxX + 14, hudBoxY + 30);

    ctx.font = 'bold 15px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = this.runnerTimeLeft <= 3.5 ? '#ff0055' : '#ffb703';
    ctx.fillText(`⏱️ เวลาผลัด: ${Math.ceil(this.runnerTimeLeft)}s`, hudBoxX + 14, hudBoxY + 58);
    ctx.restore();

    // 4. Team Score & Difficulty (Top-Right HUD)
    ctx.save();
    ctx.font = '900 22px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#00ff66';
    ctx.textAlign = 'right';
    ctx.fillText(`คะแนนทีม: ${this.teamScore.toLocaleString()}`, CONFIG.CANVAS_WIDTH - 24, 44);

    ctx.font = 'bold 14px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = this.bossData.color || '#ffb703';
    ctx.fillText(`บอส: ${this.bossData.nameEN} (${this.difficulty.nameTH})`, CONFIG.CANVAS_WIDTH - 24, 68);
    ctx.restore();

    // 5. Render Falling Entities
    for (const ent of this.entities) ent.render(ctx);

    // 6. Ultimate Attack Gauge (Bottom-Center of the Screen)
    ctx.save();
    const ultBarW = 460;
    const ultBarH = 22;
    const ultBarX = CONFIG.CANVAS_WIDTH / 2 - ultBarW / 2;
    const ultBarY = CONFIG.CANVAS_HEIGHT - 48;

    ctx.fillStyle = 'rgba(9, 14, 26, 0.9)';
    ctx.strokeStyle = this.isUltimateReady ? '#ffb703' : '#00f3ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(ultBarX, ultBarY, ultBarW, ultBarH);
    ctx.fillRect(ultBarX, ultBarY, ultBarW, ultBarH);

    const ultRatio = this.ultimateCharge / 100;
    ctx.fillStyle = this.isUltimateReady ? '#ffb703' : '#00f3ff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.isUltimateReady ? '#ffb703' : '#00f3ff';
    ctx.fillRect(ultBarX + 2, ultBarY + 2, (ultBarW - 4) * ultRatio, ultBarH - 4);

    ctx.font = 'bold 13px "Rajdhani", "Kanit", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.shadowBlur = 4;
    ctx.shadowColor = '#000000';
    const ultText = this.isUltimateReady
      ? '⚡ ท่าไม้ตายพร้อมแล้ว! (ULTIMATE READY!)'
      : `⚡ ชาร์จท่าไม้ตาย: ${Math.round(this.ultimateCharge)}% (กาง 5 นิ้วรับเพื่อชาร์จ)`;
    ctx.fillText(ultText, CONFIG.CANVAS_WIDTH / 2, ultBarY + 16);
    ctx.restore();

    // 7. Ultimate Attack Icon & Dwell UI (Normal Gameplay)
    if (this.isUltimateReady && !this.isFirstUltimateTutorialActive) {
      ctx.save();
      const iconX = this.ultimateIconPos.x;
      const iconY = this.ultimateIconPos.y;
      const r = this.ultimateIconPos.radius;

      // Instruction banner
      ctx.font = 'bold 16px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ffb703';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ffb703';
      ctx.fillText('⚡ กางมือค้างไว้ที่ไอคอน 3 วินาที เพื่อยิงท่าไม้ตาย! (HOLD OPEN HAND 3s)', iconX, iconY - r - 14);

      // Draw Icon Image or SVG
      const ultImg = assetManager.getImage('ultimate_icon');
      if (ultImg && ultImg.complete && ultImg.naturalWidth > 0) {
        ctx.drawImage(ultImg, iconX - r, iconY - r, r * 2, r * 2);
      } else {
        ctx.beginPath();
        ctx.arc(iconX, iconY, r, 0, Math.PI * 2);
        ctx.fillStyle = '#090e1a';
        ctx.strokeStyle = '#ffb703';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fill();

        ctx.font = '900 20px "Rajdhani", "Kanit", sans-serif';
        ctx.fillStyle = '#00f3ff';
        ctx.fillText('⚡ ULT', iconX, iconY + 8);
      }

      // Circular 3-Second Hold Countdown Ring
      if (this.ultimateHoldTimer > 0) {
        const holdRatio = Math.min(1.0, this.ultimateHoldTimer / 3.0);
        ctx.beginPath();
        ctx.arc(iconX, iconY, r + 12, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * holdRatio));
        ctx.strokeStyle = '#ff0055';
        ctx.lineWidth = 6;
        ctx.shadowBlur = 16;
        ctx.shadowColor = '#ff0055';
        ctx.stroke();

        ctx.font = '900 22px "Rajdhani", "Kanit", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`${(3.0 - this.ultimateHoldTimer).toFixed(1)}s`, iconX, iconY + 6);
      }

      ctx.restore();
    }

    // 8. Runner Switch Banner (Brief transition)
    if (this.switchBannerTimer > 0 && !this.isSwitchCountdown) {
      ctx.save();
      ctx.fillStyle = 'rgba(5, 8, 18, 0.85)';
      ctx.fillRect(0, CONFIG.CANVAS_HEIGHT / 2 - 50, CONFIG.CANVAS_WIDTH, 100);

      ctx.font = '900 42px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#00e5ff';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#00e5ff';
      ctx.fillText(`⚡ นินจาคนที่ ${this.currentRunner} เข้าประจำตำแหน่ง! (GO!)`, CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT / 2 + 15);
      ctx.restore();
    }

    // =========================================================================
    // 9. FIRST-TIME ULTIMATE TUTORIAL OVERLAY (Spotlight + Pause + Instructions)
    // =========================================================================
    if (this.isFirstUltimateTutorialActive) {
      ctx.save();
      // 1. Dim background
      ctx.fillStyle = 'rgba(3, 7, 18, 0.86)';
      ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

      const iconX = this.ultimateIconPos.x;
      const iconY = this.ultimateIconPos.y;
      const r = this.ultimateIconPos.radius;

      // 2. Energetic spotlight glow behind the ultimate icon
      const pulse = 1 + Math.sin(this.tutorialPulseTimer * 5) * 0.15;
      const grad = ctx.createRadialGradient(iconX, iconY, r * 0.5, iconX, iconY, r * 2.6 * pulse);
      grad.addColorStop(0, 'rgba(0, 243, 255, 0.6)');
      grad.addColorStop(0.5, 'rgba(255, 183, 3, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(iconX, iconY, r * 2.6 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Concentric pulsing rings
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(iconX, iconY, r + (i * 18 * pulse), 0, Math.PI * 2);
        ctx.strokeStyle = i === 1 ? '#00f3ff' : '#ffb703';
        ctx.lineWidth = 3 - i * 0.5;
        ctx.stroke();
      }

      // 3. Central Tutorial Instruction Box
      const boxW = 820;
      const boxH = 170;
      const boxX = CONFIG.CANVAS_WIDTH / 2 - boxW / 2;
      const boxY = 175;

      ctx.fillStyle = 'rgba(9, 14, 28, 0.95)';
      ctx.strokeStyle = '#ffb703';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ffb703';
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      ctx.fillRect(boxX, boxY, boxW, boxH);

      // Header
      ctx.font = '900 26px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ffb703';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffb703';
      ctx.fillText('⚡ ท่าไม้ตายชาร์จเต็ม 100%! (FIRST-TIME ULTIMATE TUTORIAL)', CONFIG.CANVAS_WIDTH / 2, boxY + 40);

      // Instructions
      ctx.font = 'bold 20px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 0;
      ctx.fillText('✋ วิธีใช้: กางมือ 5 นิ้วค้างไว้ที่ไอคอนวงกลมด้านล่างให้ครบ 3 วินาที', CONFIG.CANVAS_WIDTH / 2, boxY + 76);

      ctx.font = '16px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#00f3ff';
      ctx.fillText('(Hold open palm over the glowing button for 3s to unleash ultimate attack)', CONFIG.CANVAS_WIDTH / 2, boxY + 104);

      // Status of dwell
      const holdSec = this.ultimateHoldTimer.toFixed(1);
      const isDwellActive = this.ultimateHoldTimer > 0;
      ctx.font = '900 18px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = isDwellActive ? '#00ff66' : '#ffb703';
      ctx.fillText(`⏱️ เวลาฝึกกางมือค้าง: ${holdSec} / 3.0s ${isDwellActive ? '🔥 กำลังชาร์จ!' : '👉 นำมือมากางทาบที่ไอคอน'} (เกมหยุดเวลาชั่วคราว)`, CONFIG.CANVAS_WIDTH / 2, boxY + 142);

      // 4. Draw Ultimate Icon inside the spotlight
      const ultImg = assetManager.getImage('ultimate_icon');
      if (ultImg && ultImg.complete && ultImg.naturalWidth > 0) {
        ctx.drawImage(ultImg, iconX - r, iconY - r, r * 2, r * 2);
      } else {
        ctx.beginPath();
        ctx.arc(iconX, iconY, r, 0, Math.PI * 2);
        ctx.fillStyle = '#090e1a';
        ctx.strokeStyle = '#ffb703';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.fill();

        ctx.font = '900 24px "Rajdhani", "Kanit", sans-serif';
        ctx.fillStyle = '#00f3ff';
        ctx.fillText('⚡ ULT', iconX, iconY + 8);
      }

      // 5. Circular Hold Progress Ring
      if (this.ultimateHoldTimer > 0) {
        const holdRatio = Math.min(1.0, this.ultimateHoldTimer / 3.0);
        ctx.beginPath();
        ctx.arc(iconX, iconY, r + 14, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * holdRatio));
        ctx.strokeStyle = '#00ff66';
        ctx.lineWidth = 8;
        ctx.shadowBlur = 18;
        ctx.shadowColor = '#00ff66';
        ctx.stroke();

        ctx.font = '900 24px "Rajdhani", "Kanit", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`${(3.0 - this.ultimateHoldTimer).toFixed(1)}s`, iconX, iconY + 8);
      }

      ctx.restore();
    }

    // =========================================================================
    // 10. RUNNER SWITCH COUNTDOWN OVERLAY (Dark fade + Red warning + 5..1..GO!)
    // =========================================================================
    if (this.isSwitchCountdown) {
      ctx.save();
      // Full screen dark/black fade
      ctx.fillStyle = 'rgba(0, 0, 0, 0.94)';
      ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

      // Red Warning Cyber Border
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 5;
      ctx.shadowBlur = 24;
      ctx.shadowColor = '#ff0055';
      ctx.strokeRect(30, 30, CONFIG.CANVAS_WIDTH - 60, CONFIG.CANVAS_HEIGHT - 60);

      // Red Warning Banner
      ctx.font = '900 38px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ff0055';
      ctx.textAlign = 'center';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ff0055';
      ctx.fillText('⚠️ แจ้งเตือน: เตรียมเปลี่ยนตัวผู้เล่น! ⚠️', CONFIG.CANVAS_WIDTH / 2, 140);

      ctx.font = 'bold 20px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ff7799';
      ctx.shadowBlur = 6;
      ctx.fillText('RUNNER SWITCH INCOMING - GET READY TO SWAP NINJAS!', CONFIG.CANVAS_WIDTH / 2, 175);

      // Runner Swap Details Card
      const cardW = 600;
      const cardH = 80;
      const cardX = CONFIG.CANVAS_WIDTH / 2 - cardW / 2;
      const cardY = 215;

      ctx.fillStyle = 'rgba(255, 0, 85, 0.12)';
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 2;
      ctx.strokeRect(cardX, cardY, cardW, cardH);
      ctx.fillRect(cardX, cardY, cardW, cardH);

      ctx.font = '900 24px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 0;
      ctx.fillText(`🏃 ส่งต่อผลัด: คนที่ ${this.currentRunner}  ➔  คนที่ ${this.nextRunner}`, CONFIG.CANVAS_WIDTH / 2, cardY + 48);

      // Countdown Display
      const remainSec = Math.ceil(this.switchCountdownTime);
      if (this.switchCountdownTime > 0.35) {
        // Giant Countdown Number 5, 4, 3, 2, 1
        ctx.font = '900 150px "Rajdhani", "Kanit", sans-serif';
        ctx.fillStyle = '#ff0055';
        ctx.shadowBlur = 40;
        ctx.shadowColor = '#ff0055';
        ctx.fillText(`${remainSec}`, CONFIG.CANVAS_WIDTH / 2, 450);

        ctx.font = 'bold 22px "Rajdhani", "Kanit", sans-serif';
        ctx.fillStyle = '#ffb703';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffb703';
        ctx.fillText('วินาที (SECONDS)', CONFIG.CANVAS_WIDTH / 2, 495);
      } else {
        // Giant GO!
        ctx.font = '900 160px "Rajdhani", "Kanit", sans-serif';
        ctx.fillStyle = '#00ff66';
        ctx.shadowBlur = 50;
        ctx.shadowColor = '#00ff66';
        ctx.fillText('GO!', CONFIG.CANVAS_WIDTH / 2, 450);

        ctx.font = '900 26px "Rajdhani", "Kanit", sans-serif';
        ctx.fillStyle = '#00f3ff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00f3ff';
        ctx.fillText('ลุยเลย! (START FIGHTING!)', CONFIG.CANVAS_WIDTH / 2, 495);
      }

      // Freeze notice
      ctx.font = 'bold 16px "Rajdhani", "Kanit", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.shadowBlur = 0;
      ctx.fillText('⏸️ เวลาและมัลแวร์ในเกมหยุดนิ่งชั่วคราว เพื่อความปลอดภัยและเป็นธรรมในการเปลี่ยนตัว', CONFIG.CANVAS_WIDTH / 2, 580);

      ctx.restore();
    }
  }
}
