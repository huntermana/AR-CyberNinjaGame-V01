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

    const now = performance.now();
    
    // Outer Neon Glow Ribbon
    for (let i = 1; i < this.history.length; i++) {
      const p1 = this.history[i - 1];
      const p2 = this.history[i];
      const ageRatio = (now - p2.time) / this.maxAge; // 0 (new) to 1 (old)
      const alpha = Math.max(0, 1.0 - ageRatio);
      const width = Math.max(2, (1.0 - ageRatio) * 16);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = `${mainColor}${alpha})`;
      ctx.lineWidth = width;
      ctx.stroke();
    }

    // Inner Laser Core (Bright White center)
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

    ctx.restore();
  }

  clear() {
    this.history = [];
  }
}
