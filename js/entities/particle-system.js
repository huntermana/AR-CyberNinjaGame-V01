// Cyber Ninja: Firewall Slasher - Visual Effects & Particle Systems

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.splitSlices = []; // Sliced entity halves flying apart
    this.screenFlashes = []; // Screen flash effects
  }

  // 1. Emit glowing laser sparks at collision point
  emitSparks(x, y, color = '#00f3ff', count = 16, baseSpeed = 300) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 0.7 + 0.3) * baseSpeed;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: color,
        alpha: 1.0,
        decay: Math.random() * 1.5 + 1.2, // alpha loss per second
        shape: Math.random() > 0.4 ? 'square' : 'circle' // Cyber digital squares
      });
    }
  }

  // 2. Split an entity into two halved pieces flying apart
  emitSplitSlice(entity, slashAngle) {
    const normalAngle = slashAngle + Math.PI / 2;
    const separationSpeed = 260;

    // Piece 1 (Top/Left half)
    this.splitSlices.push({
      img: entity.imgElement,
      x: entity.x,
      y: entity.y,
      vx: Math.cos(normalAngle) * separationSpeed,
      vy: Math.sin(normalAngle) * separationSpeed - 120,
      radius: entity.radius,
      rotation: 0,
      vRot: (Math.random() - 0.5) * 8,
      alpha: 1.0,
      decay: 1.8,
      clipSide: 1, // Cut top/left
      color: entity.color,
      slashAngle: slashAngle
    });

    // Piece 2 (Bottom/Right half)
    this.splitSlices.push({
      img: entity.imgElement,
      x: entity.x,
      y: entity.y,
      vx: -Math.cos(normalAngle) * separationSpeed,
      vy: -Math.sin(normalAngle) * separationSpeed - 120,
      radius: entity.radius,
      rotation: 0,
      vRot: (Math.random() - 0.5) * 8,
      alpha: 1.0,
      decay: 1.8,
      clipSide: -1, // Cut bottom/right
      color: entity.color,
      slashAngle: slashAngle
    });
  }

  // 3. Screen Flash (Glitch red or Victory gold/cyan)
  addScreenFlash(color = '#ff0055', duration = 0.25, maxAlpha = 0.4) {
    this.screenFlashes.push({
      color: color,
      duration: duration,
      elapsed: 0,
      maxAlpha: maxAlpha
    });
  }

  update(dt) {
    // Update sparks
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 200 * dt; // slight gravity
      p.alpha -= p.decay * dt;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update split slices
    for (let i = this.splitSlices.length - 1; i >= 0; i--) {
      const s = this.splitSlices[i];
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.vy += 450 * dt; // gravity
      s.rotation += s.vRot * dt;
      s.alpha -= s.decay * dt;
      if (s.alpha <= 0) {
        this.splitSlices.splice(i, 1);
      }
    }

    // Update screen flashes
    for (let i = this.screenFlashes.length - 1; i >= 0; i--) {
      const f = this.screenFlashes[i];
      f.elapsed += dt;
      if (f.elapsed >= f.duration) {
        this.screenFlashes.splice(i, 1);
      }
    }
  }

  render(ctx) {
    ctx.save();

    // Render screen flashes
    for (const f of this.screenFlashes) {
      const progress = f.elapsed / f.duration;
      const alpha = (1.0 - progress) * f.maxAlpha;
      ctx.fillStyle = f.color;
      ctx.globalAlpha = alpha;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // Render sliced halves
    for (const s of this.splitSlices) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, s.alpha);
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);

      // Clip half
      ctx.beginPath();
      if (s.clipSide === 1) {
        ctx.rect(-s.radius - 10, -s.radius - 10, (s.radius + 10) * 2, s.radius + 10);
      } else {
        ctx.rect(-s.radius - 10, 0, (s.radius + 10) * 2, s.radius + 10);
      }
      ctx.clip();

      if (s.img && s.img.complete && s.img.naturalWidth > 0) {
        ctx.drawImage(s.img, -s.radius, -s.radius, s.radius * 2, s.radius * 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();
      }

      // Neon slice laser cut border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00f3ff';
      ctx.beginPath();
      ctx.moveTo(-s.radius, 0);
      ctx.lineTo(s.radius, 0);
      ctx.stroke();

      ctx.restore();
    }

    // Render particles & sparks
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;

      if (p.shape === 'square') {
        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    ctx.restore();
  }

  clear() {
    this.particles = [];
    this.splitSlices = [];
    this.screenFlashes = [];
  }
}
