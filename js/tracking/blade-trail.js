// Cyber Ninja: Firewall Slasher - Cyber Blade Neon Trail Renderer

export class BladeTrail {
  constructor(colorTheme = 'cyan') {
    this.colorTheme = colorTheme; // 'cyan' or 'magenta'
    this.history = []; // Array of { x, y, time }
    this.maxAge = 200; // Trail lifespan in ms
  }

  setColorTheme(theme) {
    this.colorTheme = theme;
  }

  addPoint(x, y) {
    const now = performance.now();
    this.history.push({ x, y, time: now });
  }

  update() {
    const now = performance.now();
    this.history = this.history.filter(pt => (now - pt.time) < this.maxAge);
  }

  render(ctx) {
    if (this.history.length < 2) return;

    ctx.save();
    
    // Choose neon cyberpunk palette
    const isCyan = this.colorTheme === 'cyan';
    const mainColor = isCyan ? 'rgba(0, 243, 255, ' : 'rgba(255, 0, 85, ';
    const coreColor = isCyan ? 'rgba(255, 255, 255, ' : 'rgba(255, 220, 230, ';
    const glowColor = isCyan ? '#00e5ff' : '#ff0055';

    ctx.shadowBlur = 18;
    ctx.shadowColor = glowColor;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const isSmooth = Boolean(window.isSmoothMode);
    const now = performance.now();

    if (isSmooth) {
      // ⚡ FAST TABLET / MOBILE PATH (Zero shadowBlur GPU overhead, 100% hardware rasterized)
      // Pass 1: Wide Translucent Halo (Soft Neon Blade Aura)
      for (let i = 1; i < this.history.length; i++) {
        const p1 = this.history[i - 1];
        const p2 = this.history[i];
        const ageRatio = (now - p2.time) / this.maxAge;
        const alpha = Math.max(0, 1.0 - ageRatio);
        const width = Math.max(4, (1.0 - ageRatio) * 22);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `${mainColor}${alpha * 0.3})`;
        ctx.lineWidth = width;
        ctx.stroke();
      }

      // Pass 2: Vivid Blade Ribbon
      for (let i = 1; i < this.history.length; i++) {
        const p1 = this.history[i - 1];
        const p2 = this.history[i];
        const ageRatio = (now - p2.time) / this.maxAge;
        const alpha = Math.max(0, 1.0 - ageRatio);
        const width = Math.max(2, (1.0 - ageRatio) * 12);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `${mainColor}${alpha * 0.9})`;
        ctx.lineWidth = width;
        ctx.stroke();
      }

      // Pass 3: Crisp Laser Core (Pure White)
      for (let i = 1; i < this.history.length; i++) {
        const p1 = this.history[i - 1];
        const p2 = this.history[i];
        const ageRatio = (now - p2.time) / this.maxAge;
        const alpha = Math.max(0, (1.0 - ageRatio) * 0.95);
        const width = Math.max(1, (1.0 - ageRatio) * 4);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `${coreColor}${alpha})`;
        ctx.lineWidth = width;
        ctx.stroke();
      }

      // Fast Katana Tip Indicator
      const latest = this.history[this.history.length - 1];
      if (latest) {
        ctx.beginPath();
        ctx.arc(latest.x, latest.y, 9, 0, Math.PI * 2);
        ctx.fillStyle = isCyan ? 'rgba(0, 243, 255, 0.45)' : 'rgba(255, 0, 85, 0.45)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(latest.x, latest.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }
    } else {
      // ✨ HIGH QUALITY PC PATH (Full Gaussian glow shadow blur)
      ctx.shadowBlur = 18;
      ctx.shadowColor = glowColor;

      // Outer Neon Glow Ribbon
      for (let i = 1; i < this.history.length; i++) {
        const p1 = this.history[i - 1];
        const p2 = this.history[i];
        const ageRatio = (now - p2.time) / this.maxAge;
        const alpha = Math.max(0, 1.0 - ageRatio);
        const width = Math.max(2, (1.0 - ageRatio) * 16);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `${mainColor}${alpha})`;
        ctx.lineWidth = width;
        ctx.stroke();
      }

      // Inner Laser Core
      ctx.shadowBlur = 6;
      for (let i = 1; i < this.history.length; i++) {
        const p1 = this.history[i - 1];
        const p2 = this.history[i];
        const ageRatio = (now - p2.time) / this.maxAge;
        const alpha = Math.max(0, (1.0 - ageRatio) * 0.9);
        const width = Math.max(1, (1.0 - ageRatio) * 6);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `${coreColor}${alpha})`;
        ctx.lineWidth = width;
        ctx.stroke();
      }

      // Glowing Katana Tip Particle
      const latest = this.history[this.history.length - 1];
      if (latest) {
        ctx.beginPath();
        ctx.arc(latest.x, latest.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 24;
        ctx.shadowColor = glowColor;
        ctx.fill();
      }
    }

    ctx.restore();
  }

  clear() {
    this.history = [];
  }
}
