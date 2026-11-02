// A canvas port of the iOS app's coin stage (CoinStage.swift / HomeLogo.swift): spring-driven 3D line-art coins,
// rim notches, a knocked-out face ring and four-point sparkles. Units match the app: radius = 100 × scale.

export type Pose = { x: number; y: number; s: number; wx: number; wy: number; lz: number; g: number };
export type Flight = { vx: number; vy: number; gravity: number; ax: number; ay: number; az: number };
type Spring = [number, number];

const TAU = Math.PI * 2;
const pose = (g = 1): Pose => ({ x: 0, y: 0, s: 0, wx: 0, wy: 0, lz: 0, g });

export class Coin {
  p = pose();
  v = pose(0);
  t = pose();
  /** Spring stiffness and damping for position, rotation and scale. */
  kp: Spring = [90, 16];
  kr: Spring = [110, 17];
  ks: Spring = [150, 19];
  spinning = false;
  spinRate = 0;
  z = 0;
  face: string | null = null;
  /** Idle coins bob and sway slightly. */
  idle = true;
  phase = Math.random() * TAU;
  flight: Flight | null = null;

  place(x: number, y: number, s: number) {
    this.t.x = x; this.t.y = y; this.t.s = s;
  }
  snap(x: number, y: number, s: number) {
    this.place(x, y, s);
    this.p.x = x; this.p.y = y; this.p.s = s;
    this.v.x = 0; this.v.y = 0; this.v.s = 0;
  }
  /** Targets an orientation by the shortest way round from the current target. */
  pose(o: { wx?: number; wy?: number; lz?: number }) {
    if (o.wx !== undefined) this.t.wx = o.wx + TAU * Math.round((this.t.wx - o.wx) / TAU);
    if (o.wy !== undefined) this.t.wy = o.wy + TAU * Math.round((this.t.wy - o.wy) / TAU);
    if (o.lz !== undefined) this.t.lz = o.lz + TAU * Math.round((this.t.lz - o.lz) / TAU);
  }
  snapAngles(o: { wx: number; wy: number; lz: number }) {
    this.p.wx = this.t.wx = o.wx;
    this.p.wy = this.t.wy = o.wy;
    this.p.lz = this.t.lz = o.lz;
    this.v.wx = this.v.wy = this.v.lz = 0;
  }
  setFace(face: string | null, pulse = true) {
    this.face = face;
    if (pulse) { this.p.g = 0.75; this.v.g = 0; }
  }

  update(dt: number, bounds: { width: number; height: number }) {
    const f = this.flight;
    if (f) {
      f.vy += f.gravity * dt;
      this.p.x += f.vx * dt; this.p.y += f.vy * dt;
      this.p.wx += f.ax * dt; this.p.wy += f.ay * dt; this.p.lz += f.az * dt;
      if (this.p.y > bounds.height + 140 || this.p.x < -140 || this.p.x > bounds.width + 140) {
        this.flight = null; this.p.s = 0; this.t.s = 0;
      }
      return;
    }
    const h = dt / 2, p = this.p, v = this.v, t = this.t;
    const spring = (key: keyof Pose, k: Spring) => {
      v[key] += (k[0] * (t[key] - p[key]) - k[1] * v[key]) * h;
      p[key] += v[key] * h;
    };
    for (let i = 0; i < 2; i++) {
      spring("x", this.kp); spring("y", this.kp);
      spring("s", this.ks);
      spring("wx", this.kr); spring("lz", this.kr);
      if (this.spinning) { v.wy += (this.spinRate - v.wy) * Math.min(1, 5 * h); p.wy += v.wy * h; }
      else spring("wy", this.kr);
      spring("g", [180, 16]);
    }
  }

  get isSettled() {
    if (this.flight || this.spinning) return false;
    const { p, v, t } = this;
    const near = Math.abs(t.x - p.x) < 0.05 && Math.abs(t.y - p.y) < 0.05 && Math.abs(t.s - p.s) < 0.0005
      && Math.abs(t.wx - p.wx) < 0.002 && Math.abs(t.wy - p.wy) < 0.002 && Math.abs(t.lz - p.lz) < 0.002 && Math.abs(t.g - p.g) < 0.002;
    const still = Math.abs(v.x) + Math.abs(v.y) < 0.1 && Math.abs(v.s) < 0.002 && Math.abs(v.wx) + Math.abs(v.wy) + Math.abs(v.lz) < 0.01;
    return near && still;
  }
}

/** Shared constants for the coin choreography, as in the app. */
export const Geometry = {
  frontRest: { wx: 0.5, wy: 0.6, lz: 0 },
  backRest: { wx: 0.41, wy: -1.02, lz: 0 },
  /** Tilt of a coin lying flat in the progress stack. */
  lying: Math.PI / 2 - 0.72,
  thickness: 0.44,
  /** Where the 3D coins sit to stand in for the launch artwork drawn centred at (cx, cy), `height` tall. */
  artCoins(cx: number, cy: number, height: number) {
    const k = height / 1457;
    const place = (x: number, y: number) => ({ x: cx + (x - 1428 / 2) * k, y: cy + (y - 1457 / 2) * k });
    return { front: place(555, 561), back: place(1003, 926), scale: (520 * k) / 100 };
  },
  /** The launch artwork's sparkle centres for the same placement. */
  artStars(cx: number, cy: number, height: number) {
    const k = height / 1457;
    const place = (x: number, y: number) => ({ x: cx + (x - 1428 / 2) * k, y: cy + (y - 1457 / 2) * k });
    return { upper: place(1210, 230), lower: place(260, 1225) };
  },
};

type Star = { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number; rot: number; spin: number; drag: number };

/** Four-point sparkle particles. */
export class Stars {
  stars: Star[] = [];
  reduceMotion = false;

  add(x: number, y: number, o: Partial<Omit<Star, "x" | "y" | "life">> = {}) {
    this.stars.push({ x, y, vx: 0, vy: 0, r: 10, max: 0.9, rot: 0, spin: 0, drag: 2.4, life: 0, ...o });
  }
  burst(x: number, y: number, count: number, speed = 200, radius: [number, number] = [5, 11]) {
    const n = this.reduceMotion ? Math.min(count, 3) : count;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + rand(-0.3, 0.3), s = speed * rand(0.5, 1.1);
      this.add(x, y, { vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: rand(...radius), max: rand(0.7, 1.2), spin: rand(-5, 5) });
    }
  }
  sparkle(c: Coin, count = 1) {
    const r = 100 * c.p.s;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * TAU, d = r * rand(1.1, 1.7);
      this.add(c.p.x + Math.cos(a) * d, c.p.y + Math.sin(a) * d * 0.85, { r: rand(4, 8), max: rand(0.6, 1), rot: Math.random(), spin: rand(-2, 2), drag: 4 });
    }
  }
  get isEmpty() { return this.stars.length === 0; }

  update(dt: number) {
    this.stars = this.stars.filter((s) => {
      s.life += dt;
      if (s.life >= s.max) return false;
      const d = Math.exp(-s.drag * dt);
      s.vx *= d; s.vy *= d; s.x += s.vx * dt; s.y += s.vy * dt; s.rot += s.spin * dt;
      return true;
    });
  }

  draw(ctx: CanvasRenderingContext2D, ink: string) {
    ctx.fillStyle = ink;
    for (const s of this.stars) {
      const f = s.life / s.max;
      // Back-eased pop over the first 22%, then a quadratic shrink.
      let scale: number;
      if (f < 0.22) { const t = f / 0.22, c1 = 1.7; scale = 1 + (c1 + 1) * (t - 1) ** 3 + c1 * (t - 1) ** 2; }
      else scale = 1 - ((f - 0.22) / 0.78) ** 2;
      if (scale <= 0) continue;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate((s.rot * Math.PI) / 2);
      starPath(ctx, s.r * scale);
      ctx.fill();
      ctx.restore();
    }
  }
}

export function rand(a: number, b: number) { return a + Math.random() * (b - a); }

export function starPath(ctx: CanvasRenderingContext2D, r: number) {
  const c = 0.17 * r;
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(c, -c, r, 0);
  ctx.quadraticCurveTo(c, c, 0, r);
  ctx.quadraticCurveTo(-c, c, -r, 0);
  ctx.quadraticCurveTo(-c, -c, 0, -r);
  ctx.closePath();
}

const NOTCHES = 20, GAP = 0.2, NOTCH_TOP = 0.25, NOTCH_BOTTOM = 0.75, KAPPA = 0.17, RING = 0.9;

/**
 * Draws a coin as solid ink, with its rim notches and face ring painted in `hole` (the colour behind it), as the app
 * does: painting the holes rather than erasing keeps every coin a handful of fills.
 */
export function drawCoin(ctx: CanvasRenderingContext2D, c: Coin, time: number, ink: string, hole: string, reduceMotion: boolean) {
  const R = 100 * c.p.s;
  if (R < 0.8) return;
  const bob = c.idle && !reduceMotion ? 1 : 0;
  const wx = c.p.wx + bob * Math.cos(time * 0.9 + c.phase) * 0.02;
  const wy = c.p.wy + bob * Math.sin(time * 0.7 + c.phase) * 0.03;
  const lz = c.p.lz;
  const cx = Math.cos(wx), sx = Math.sin(wx), cy = Math.cos(wy), sy = Math.sin(wy), cz = Math.cos(lz), sz = Math.sin(lz);
  const m00 = cy * cz + sy * sx * sz, m01 = -cy * sz + sy * sx * cz, m02 = sy * cx;
  const m10 = cx * sz, m11 = cx * cz, m12 = -sx;
  const m20 = -sy * cz + cy * sx * sz, m21 = sy * sz + cy * sx * cz, m22 = cy * cx;
  const tk = Geometry.thickness * R, X = c.p.x, Y = c.p.y + bob * Math.sin(time * 1.25 + c.phase) * 1.2;

  const ellipse = (z: number, r: number, flip = 1) => {
    ctx.save();
    ctx.transform(flip * m00, flip * m10, m01, m11, X + m02 * z, Y + m12 * z);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, TAU);
    ctx.restore();
  };

  ctx.fillStyle = ink;
  ellipse(tk / 2, R); ctx.fill();
  ellipse(-tk / 2, R); ctx.fill();

  // The rim: a quad joining the two faces' silhouette tangent points.
  const dx = -m02 * tk, dy = -m12 * tk;
  if (Math.hypot(dx, dy) > 0.5) {
    const a = -m00 * dy + m10 * dx, b = m01 * dy - m11 * dx, t0 = Math.atan2(-b, a);
    const pt = (th: number, z: number): [number, number] => [
      X + m00 * R * Math.cos(th) + m01 * R * Math.sin(th) + m02 * z,
      Y + m10 * R * Math.cos(th) + m11 * R * Math.sin(th) + m12 * z,
    ];
    ctx.beginPath();
    ctx.moveTo(...pt(t0, tk / 2)); ctx.lineTo(...pt(t0, -tk / 2));
    ctx.lineTo(...pt(t0 + Math.PI, -tk / 2)); ctx.lineTo(...pt(t0 + Math.PI, tk / 2));
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = ink; ctx.lineWidth = 0.6; ctx.stroke();
  }

  // Rim notches on the visible side of the edge.
  const amp = Math.hypot(m20, m21);
  if (amp > KAPPA + 0.02 && R > 13) {
    const al = Math.atan2(m21, m20), half = Math.acos(KAPPA / amp), pitch = TAU / NOTCHES, w = pitch * (0.5 - GAP);
    const zA = tk * (0.5 - NOTCH_TOP), zB = tk * (0.5 - NOTCH_BOTTOM);
    ctx.beginPath();
    for (let k = 0; k < NOTCHES; k++) {
      let d = ((k + 0.5) * pitch - al) % TAU;
      if (d > Math.PI) d -= TAU;
      if (d < -Math.PI) d += TAU;
      const lo = Math.max(d - w, -half), hi = Math.min(d + w, half);
      if (hi - lo < 0.03) continue;
      const n = Math.max(2, Math.ceil((hi - lo) / 0.07));
      const pt = (j: number, z: number): [number, number] => {
        const th = al + lo + ((hi - lo) * j) / n, x = R * Math.cos(th), y = R * Math.sin(th);
        return [X + m00 * x + m01 * y + m02 * z, Y + m10 * x + m11 * y + m12 * z];
      };
      ctx.moveTo(...pt(0, zA));
      for (let j = 1; j <= n; j++) ctx.lineTo(...pt(j, zA));
      for (let j = n; j >= 0; j--) ctx.lineTo(...pt(j, zB));
      ctx.closePath();
    }
    ctx.fillStyle = hole;
    ctx.fill();
  }

  // The face turned towards the viewer: a knocked-out ring holding the glyph (the back face shows the brand star).
  if (Math.abs(m22) <= 0.035) return;
  const sg = m22 >= 0 ? 1 : -1;
  ctx.fillStyle = hole;
  ellipse((sg * tk) / 2, R * RING, sg); ctx.fill();
  if (Math.abs(m22) <= 0.12 || R <= 9) return;
  ctx.save();
  ctx.transform(sg * m00, sg * m10, m01, m11, X + (m02 * sg * tk) / 2, Y + (m12 * sg * tk) / 2);
  ctx.scale(c.p.g, c.p.g);
  ctx.fillStyle = ink;
  if (sg < 0) { starPath(ctx, R * RING * 0.5); ctx.fill(); }
  else if (c.face) {
    const size = R * RING * (c.face.length > 2 ? 0.62 : c.face.length > 1 ? 0.72 : 0.95);
    ctx.font = `600 ${size}px ui-rounded, "SF Pro Rounded", system-ui, -apple-system, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(c.face, 0, size * 0.04);
  }
  ctx.restore();
}

/** A requestAnimationFrame loop that sleeps while its canvas is off-screen or the tab is hidden. */
export function runLoop(canvas: HTMLCanvasElement, frame: (dt: number, time: number) => boolean | void) {
  let raf = 0, last = 0, time = 0, visible = true, stopped = false, idle = false;
  const tick = (now: number) => {
    raf = 0;
    if (stopped) return;
    const dt = last ? Math.min(Math.max((now - last) / 1000, 0), 1 / 20) : 1 / 60;
    last = now;
    time += dt;
    idle = frame(dt, time) === false;
    if (visible && !idle) raf = requestAnimationFrame(tick);
  };
  const wake = () => {
    if (!raf && visible && !stopped) { idle = false; last = 0; raf = requestAnimationFrame(tick); }
  };
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting && !document.hidden;
    if (visible) wake();
  });
  io.observe(canvas);
  const onVis = () => { visible = !document.hidden; if (visible) wake(); };
  document.addEventListener("visibilitychange", onVis);
  wake();
  return {
    wake,
    stop() { stopped = true; if (raf) cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener("visibilitychange", onVis); },
  };
}

/** Sizes a canvas to its CSS box at device pixel ratio and returns a context in CSS pixels. */
export function fitCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  const { width, height } = canvas.getBoundingClientRect();
  const w = Math.round(width * dpr), h = Math.round(height * dpr);
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Reads a CSS custom property off an element (colours used for ink and holes follow the theme). */
export function cssVar(el: Element, name: string) {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

/** The `.hero-card` gradient (globals.css) at a point in a w × h card, for painting coin holes on green. */
export function heroCardColour(x: number, y: number, w: number, h: number) {
  const len = (w + h) / Math.SQRT2;
  const t = Math.min(1, Math.max(0, ((x - w / 2) * Math.SQRT1_2 + (y - h / 2) * Math.SQRT1_2) / len + 0.5));
  let r = 0, g = 0x54 + (0x35 - 0x54) * t, b = 0x24 + (0x1a - 0x24) * t;
  const d = Math.hypot((x - w) / (1.2 * w), y / (0.9 * h));
  const a = 0.13 * Math.max(0, 1 - d / 0.55);
  r += (255 - r) * a; g += (255 - g) * a; b += (255 - b) * a;
  return `rgb(${r.toFixed(1)} ${g.toFixed(1)} ${b.toFixed(1)})`;
}
