// Cyber Ninja: Firewall Slasher - Safe Data Packet Entity (Catch with Open Palm!)

import { i18n } from '../i18n.js';

export class SafePacket {
  constructor(typeData, x, y, vx, vy) {
    this.id = typeData.id;
    this.typeData = typeData;
    this.nameTH = typeData.nameTH;
    this.nameEN = typeData.nameEN;
    this.descTH = typeData.descTH;
    this.descEN = typeData.descEN;
    this.points = typeData.points;
    this.serverHpBonus = typeData.serverHpBonus || 20;
    this.penaltyPoints = typeData.penaltyPoints || 80;
    this.color = typeData.color || '#ffb703';
    this.radius = typeData.radius || 52;

    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.gravity = 140; // Floats slower and lighter than malware
    this.floatPhase = Math.random() * Math.PI * 2;

    this.isDead = false;
    this.isCaught = false;
    this.isSlashed = false;
    this.isOffscreen = false;

    // Load sprite image
    this.imgElement = new Image();
    this.imgElement.src = typeData.image;
  }

  get name() {
    return i18n.lang === 'th' ? this.nameTH : this.nameEN;
  }

  get desc() {
    return i18n.lang === 'th' ? this.descTH : this.descEN;
  }

  // Magnetic attraction toward open palm
  pullTowardPalm(palmX, palmY, dt) {
    const dx = palmX - this.x;
    const dy = palmY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 5) {
      const pullSpeed = 480;
      this.x += (dx / dist) * pullSpeed * dt;
      this.y += (dy / dist) * pullSpeed * dt;
    }
  }

  update(dt) {
    if (this.isDead) return;

    this.floatPhase += dt * 3;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += this.gravity * dt;

    if (this.y > 800 || this.x < -100 || this.x > 1400) {
      this.isOffscreen = true;
      this.isDead = true;
    }
  }

  render(ctx) {
    if (this.isDead) return;

    ctx.save();
    ctx.translate(this.x, this.y);

    // Pulsating golden/cyan shield aura
    const pulse = Math.sin(this.floatPhase) * 6;
    if (!window.isSmoothMode) {
      ctx.shadowBlur = 24 + pulse;
      ctx.shadowColor = this.color;
    }

    // Glowing protective containment ring
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + pulse / 2, 0, Math.PI * 2);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.stroke();

    // Dark solid backdrop
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#06101e';
    ctx.fill();

    // Inner Safe Sprite
    if (this.imgElement.complete && this.imgElement.naturalWidth > 0) {
      const spriteSize = this.radius * 1.6;
      ctx.drawImage(this.imgElement, -spriteSize / 2, -spriteSize / 2, spriteSize, spriteSize);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    ctx.restore();

    // Prominent "CATCH! (แบมือรับ)" banner above packet
    ctx.save();
    ctx.font = '900 13px "Rajdhani", "Kanit", sans-serif';
    ctx.textAlign = 'center';
    
    // Background pill badge
    const badgeText = i18n.lang === 'th' ? '✋ แบมือรับ (ห้ามฟัน!)' : '✋ CATCH (DO NOT SLASH!)';
    const textWidth = ctx.measureText(badgeText).width;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(this.x - textWidth / 2 - 8, this.y - this.radius - 28, textWidth + 16, 22, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = this.color;
    if (!window.isSmoothMode) {
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.color;
    }
    ctx.fillText(badgeText, this.x, this.y - this.radius - 13);

    ctx.restore();
  }
}
