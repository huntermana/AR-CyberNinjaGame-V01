// Cyber Ninja: Firewall Slasher - Gesture Detection & Collision Math

import { CONFIG } from '../config.js';

export class GestureDetector {
  constructor() {
    this.prevPoints = new Map(); // handId -> { x, y, time }
  }

  processHand(hand) {
    const now = performance.now();
    const id = hand.id;
    const currentTip = hand.indexTip;
    const prev = this.prevPoints.get(id);

    let velocity = 0;
    let isSlashing = false;
    let slashSegment = null;

    const isOpenPalm = Boolean(hand.isOpenPalm);
    const isSingleFingerBlade = Boolean(hand.isSingleFingerBlade);
    const isBlade = !isOpenPalm && (isSingleFingerBlade || Boolean(hand.isKnifeHand));

    // IMMUNITY RULE: An Open Palm (5 fingers) hand can NEVER slash, regardless of velocity!
    // Slashes strictly require Sword Blade (ชู 2 นิ้ว) moving at or above the threshold speed
    if (prev) {
      const dt = (now - prev.time) / 1000; // seconds
      if (dt > 0.005 && dt < 0.25) {
        const dx = currentTip.x - prev.x;
        const dy = currentTip.y - prev.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        velocity = dist / dt; // pixels per second

        if (!isOpenPalm && isBlade && velocity >= CONFIG.SLASH_VELOCITY_THRESHOLD) {
          isSlashing = true;
          slashSegment = {
            x1: prev.x,
            y1: prev.y,
            x2: currentTip.x,
            y2: currentTip.y,
            velocity: velocity,
            angle: Math.atan2(dy, dx)
          };
        }
      }
    }

    this.prevPoints.set(id, { x: currentTip.x, y: currentTip.y, time: now });

    // Open Palm Catch: Active whenever hand is in 5-finger open palm, without restrictive speed caps!
    const isCatching = isOpenPalm;

    return {
      handId: id,
      handedness: hand.handedness,
      tip: currentTip,
      palm: hand.palmCenter,
      wrist: hand.wrist,
      velocity: velocity,
      isOpenPalm: isOpenPalm,
      isKnifeHand: isBlade,
      isSingleFingerBlade: isSingleFingerBlade,
      isTwoFingerBlade: isSingleFingerBlade,
      isSlashing: isSlashing,
      slashSegment: slashSegment,
      isCatching: isCatching,
      catchRadius: CONFIG.PALM_CATCH_RADIUS
    };
  }

  // Math Helper: Test if a line segment (x1, y1) -> (x2, y2) intersects a circle (cx, cy, r)
  static segmentIntersectsCircle(x1, y1, x2, y2, cx, cy, r) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;

    // Point-to-circle check if segment has almost zero length
    if (lenSq === 0) {
      const distSq = (cx - x1) * (cx - x1) + (cy - y1) * (cy - y1);
      return distSq <= r * r;
    }

    // Projection scalar t on line segment [0, 1]
    const t = Math.max(0, Math.min(1, ((cx - x1) * dx + (cy - y1) * dy) / lenSq));
    const closestX = x1 + t * dx;
    const closestY = y1 + t * dy;

    const distSq = (cx - closestX) * (cx - closestX) + (cy - closestY) * (cy - closestY);
    return distSq <= r * r;
  }

  // Math Helper: Point in Circle / Radius
  static pointInCircle(px, py, cx, cy, r) {
    const dx = px - cx;
    const dy = py - cy;
    return (dx * dx + dy * dy) <= (r * r);
  }

  // Math Helper: Point in Axis-Aligned Rect
  static pointInRect(px, py, rx, ry, rw, rh) {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
  }

  reset() {
    this.prevPoints.clear();
  }
}
