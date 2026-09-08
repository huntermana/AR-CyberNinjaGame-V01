// Cyber Ninja: Firewall Slasher - Mid-Air Floating Choice Pods & Ready Sensors

import { CONFIG } from '../config.js';
import { GestureDetector } from '../tracking/gesture-detector.js';

export class FloatingPod {
  constructor(options) {
    this.id = options.id;
    this.x = options.x;
    this.y = options.y;
    this.width = options.width || 220;
    this.height = options.height || 100;
    this.label = options.label || '';
    this.sublabel = options.sublabel || '';
    this.color = options.color || '#00e5ff';
    this.textColor = options.textColor || '#ffffff';
    this.onSelect = options.onSelect || null;

    this.fontSize = options.fontSize || 20;
    this.sublabelFontSize = options.sublabelFontSize || 14;
    this.hoverProgress = 0; // 0.0 to 1.0
    this.isTriggered = false;
    this.isArmed = options.isArmed !== false;
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.requiredDwell = options.requiredDwell || CONFIG.HOVER_TRIGGER_TIME; // ms
  }

  setArmed(state) {
    this.isArmed = state;
    if (!state) {
      this.hoverProgress = 0;
    }
  }

  update(dt, detectedHands = []) {
    if (this.isTriggered || !this.isArmed) return;

    this.pulsePhase += dt * 4;

    let isHandInside = false;

    // Check if any hand tip or palm is inside bounding box
    for (const h of detectedHands) {
      // Check hover inside box
      if (
        GestureDetector.pointInRect(h.tip.x, h.tip.y, this.x, this.y, this.width, this.height) ||
        GestureDetector.pointInRect(h.palm.x, h.palm.y, this.x, this.y, this.width, this.height)
      ) {
        isHandInside = true;
      }

      // Also allow instant slash cut through the pod
      if (h.isSlashing && h.slashSegment) {
        const seg = h.slashSegment;
        // Midpoint of slash
        const midX = (seg.x1 + seg.x2) / 2;
        const midY = (seg.y1 + seg.y2) / 2;
        if (GestureDetector.pointInRect(midX, midY, this.x, this.y, this.width, this.height)) {
          this.trigger();
          return;
        }
      }
    }

    if (isHandInside) {
      this.hoverProgress += (dt * 1000) / this.requiredDwell;
      if (this.hoverProgress >= 1.0) {
        this.hoverProgress = 1.0;
        this.trigger();
      }
    } else {
      this.hoverProgress = Math.max(0, this.hoverProgress - dt * 2.5);
    }
  }

  trigger() {
    if (this.isTriggered) return;
    this.isTriggered = true;
    if (this.onSelect) {
      this.onSelect(this);
    }
  }

  render(ctx) {
    ctx.save();

    const pulse = Math.sin(this.pulsePhase) * 4;
    ctx.shadowBlur = 16 + (this.hoverProgress * 15) + pulse;
    ctx.shadowColor = this.color;

    // Pod background
    ctx.fillStyle = this.isTriggered ? this.color : 'rgba(10, 15, 26, 0.88)';
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.isTriggered ? 5 : 3;

    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 12);
    ctx.fill();
    ctx.stroke();

    // Dwell Progress Gauge Fill
    if (this.hoverProgress > 0 && !this.isTriggered) {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.roundRect(this.x, this.y, this.width * this.hoverProgress, this.height, 12);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    // Border Highlight
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(this.x + 4, this.y + 4, this.width - 8, this.height - 8);

    // Text labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const mainFont = this.fontSize || 20;
    ctx.font = `900 ${mainFont}px "Rajdhani", "Kanit", sans-serif`;
    ctx.fillStyle = this.isTriggered ? '#000000' : this.textColor;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fillText(this.label, this.x + this.width / 2, this.y + (this.sublabel ? this.height / 2 - 14 : this.height / 2));

    if (this.sublabel) {
      const subFont = this.sublabelFontSize || 14;
      ctx.font = `bold ${subFont}px "Rajdhani", "Kanit", sans-serif`;
      if (!this.isArmed) {
        ctx.fillStyle = '#ffb703';
        ctx.fillText('🔒 กำลังเตรียมระบบ (อ่านคำถามก่อนเลือก)...', this.x + this.width / 2, this.y + this.height / 2 + 18);
      } else {
        ctx.fillStyle = this.isTriggered ? '#111111' : 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(this.sublabel, this.x + this.width / 2, this.y + this.height / 2 + 18);
      }
    }

    ctx.restore();
  }

  reset() {
    this.hoverProgress = 0;
    this.isTriggered = false;
  }
}
