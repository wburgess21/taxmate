// A canvas port of the iOS app's coin stage (CoinStage.swift): spring-driven 3D line-art coins with rim notches,
// a knocked-out face ring and four-point sparkles. Units match the app: radius = 100 × scale, angles in radians.
//
// Unlike the app, which paints holes in the backdrop's colour, coins here are cut out for real: each coin erases what
// is behind its silhouette, fills its ink, then erases its notches and face ring, so a single transparent canvas can
// float coins over any page, gradient or phone screen.

import { ICONS, type IconName } from "./icons";

export type Pose = { x: number; y: number; s: number; wx: number; wy: number; lz: number; g: number };
export type Flight = { vx: number; vy: number; gravity: number; ax: number; ay: number; az: number };
export type RGB = [number, number, number];
type Spring = [number, number];

export const TAU = Math.PI * 2;
const pose = (g = 1): Pose => ({ x: 0, y: 0, s: 0, wx: 0, wy: 0, lz: 0, g });

/** A face is text ("£", "VAT") or an icon written as "@name". The back face always shows the brand star. */
export type Face = string | null;

export class Coin {
  p = pose();
  v = pose(0);
  t = pose();
  kp: Spring = [90, 16];
  kr: Spring = [110, 17];
  ks: Spring = [150, 19];
  spinning = false;
  spinRate = 0;
  z = 0;
  face: Face = null;
  /** Idle coins bob and sway slightly. */
  idle = true;
  phase = Math.random() * TAU;
  flight: Flight | null = null;
  ink: RGB = [0, 0, 0];
  inkTarget: RGB = [0, 0, 0];
  inkRate = 6;
  opacity = 1;

  place(x: number, y: number, s?: number) {
    this.t.x = x; this.t.y = y;
    if (s !== undefined) this.t.s = s;
  }
  snap(x: number, y: number, s?: number) {
    this.place(x, y, s);
    this.p.x = x; this.p.y = y; this.v.x = 0; this.v.y = 0;
    if (s !== undefined) { this.p.s = s; this.v.s = 0; }
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
  copyAngles(o: Coin) {
    this.p.wx = o.p.wx; this.p.wy = o.p.wy; this.p.lz = o.p.lz;
    this.t.wx = o.t.wx; this.t.wy = o.t.wy; this.t.lz = o.t.lz;
    this.v.wx = this.v.wy = this.v.lz = 0;
  }
  setFace(face: Face, pulse = true) {
    this.face = face;
    if (pulse) { this.p.g = 0.75; this.v.g = 0; }
  }
  setInk(ink: RGB, snap = false) {
    this.inkTarget = ink;
    if (snap) this.ink = [...ink];
  }

  update(dt: number, bounds?: { width: number; height: number }) {
    const k = Math.min(1, dt * this.inkRate);
    for (let i = 0; i < 3; i++) this.ink[i] += (this.inkTarget[i] - this.ink[i]) * k;
    const f = this.flight;
    if (f) {
      f.vy += f.gravity * dt;
      this.p.x += f.vx * dt; this.p.y += f.vy * dt;
      this.p.wx += f.ax * dt; this.p.wy += f.ay * dt; this.p.lz += f.az * dt;
      if (bounds && (this.p.y > bounds.height + 160 || this.p.x < -160 || this.p.x > bounds.width + 160 || this.p.y < -bounds.height)) {
        this.flight = null; this.p.s = 0; this.t.s = 0;
      }
      return;
    }
    const h = dt / 2, p = this.p, v = this.v, t = this.t;
    const spring = (key: keyof Pose, s: Spring) => {
      v[key] += (s[0] * (t[key] - p[key]) - s[1] * v[key]) * h;
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
    const inked = Math.abs(this.ink[0] - this.inkTarget[0]) + Math.abs(this.ink[1] - this.inkTarget[1]) + Math.abs(this.ink[2] - this.inkTarget[2]) < 1.5;
    return near && still && inked;
  }
}

/** Shared constants for the coin choreography, as in the app. */
export const Geometry = {
  frontRest: { wx: 0.5, wy: 0.6, lz: 0 },
  backRest: { wx: 0.41, wy: -1.02, lz: 0 },
  /** Tilt of a coin lying flat in a stack. */
  lying: Math.PI / 2 - 0.72,
  thickness: 0.44,
  /** The 3D coins standing in for the launch artwork drawn centred at (cx, cy), `height` tall. */
  artCoins(cx: number, cy: number, height: number) {
    const k = height / 1457;
    const place = (x: number, y: number) => ({ x: cx + (x - 714) * k, y: cy + (y - 728.5) * k });
    return { front: place(555, 561), back: place(1003, 926), scale: (520 * k) / 100, stars: { upper: place(1210, 230), lower: place(260, 1225) }, k };
  },
  /** How far each coin in a stack rises above the one below, for coins of scale `s`. */
  stackRise(s: number) { return 0.44 * 100 * s * 1.12 * Math.sin(Math.PI / 2 - 0.72); },
};

type Star = { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number; rot: number; spin: number; drag: number; ink?: string };

/** Four-point sparkle particles. */
export class Stars {
  stars: Star[] = [];
  reduceMotion = false;

  add(x: number, y: number, o: Partial<Omit<Star, "x" | "y" | "life">> = {}) {
    this.stars.push({ x, y, vx: 0, vy: 0, r: 10, max: 0.9, rot: 0, spin: 0, drag: 2.4, life: 0, ...o });
  }
  burst(x: number, y: number, count: number, speed = 200, radius: [number, number] = [5, 11], ink?: string) {
    const n = this.reduceMotion ? Math.min(count, 3) : count;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + rand(-0.3, 0.3), s = speed * rand(0.5, 1.1);
      this.add(x, y, { vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: rand(...radius), max: rand(0.7, 1.2), spin: rand(-5, 5), ink });
    }
  }
  sparkle(c: Coin, count = 1, ink?: string) {
    const r = 100 * c.p.s;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * TAU, d = r * rand(1.15, 1.7);
      this.add(c.p.x + Math.cos(a) * d, c.p.y + Math.sin(a) * d * 0.85, { r: rand(4, 8) * Math.max(0.6, Math.min(1.6, r / 40)), max: rand(0.6, 1), rot: Math.random(), spin: rand(-2, 2), drag: 4, ink });
    }
  }
  get isEmpty() { return this.stars.length === 0; }
  clear() { this.stars = []; }

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
    for (const s of this.stars) {
      const f = s.life / s.max;
      let scale: number;
      if (f < 0.22) { const t = f / 0.22, c1 = 1.7; scale = 1 + (c1 + 1) * (t - 1) ** 3 + c1 * (t - 1) ** 2; }
      else scale = 1 - ((f - 0.22) / 0.78) ** 2;
      if (scale <= 0) continue;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate((s.rot * Math.PI) / 2);
      starPath(ctx, s.r * scale);
      ctx.fillStyle = s.ink ?? ink;
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

export const rgb = (c: RGB, a = 1) => `rgb(${c[0].toFixed(1)} ${c[1].toFixed(1)} ${c[2].toFixed(1)}${a < 1 ? ` / ${a}` : ""})`;
export function hex(h: string): RGB {
  const v = h.replace("#", "");
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}

const iconPaths = new Map<string, Path2D>();
function iconPath(name: string) {
  let p = iconPaths.get(name);
  if (!p) { p = new Path2D(ICONS[name as IconName] ?? ""); iconPaths.set(name, p); }
  return p;
}

const NOTCHES = 20, GAP = 0.2, NOTCH_TOP = 0.25, NOTCH_BOTTOM = 0.75, KAPPA = 0.17, RING = 0.9;

export type DrawOptions = {
  time: number;
  reduceMotion?: boolean;
  /** Paint holes in this colour instead of cutting them out. */
  hole?: string;
};

/** Draws one coin. Draw coins back to front; each one hides those behind it. */
export function drawCoin(ctx: CanvasRenderingContext2D, c: Coin, o: DrawOptions) {
  const R = 100 * c.p.s;
  if (R < 0.8 || c.opacity <= 0.01) return;
  const bob = c.idle && !o.reduceMotion ? 1 : 0, time = o.time;
  const wx = c.p.wx + bob * Math.cos(time * 0.9 + c.phase) * 0.02;
  const wy = c.p.wy + bob * Math.sin(time * 0.7 + c.phase) * 0.03;
  const lz = c.p.lz;
  const cx = Math.cos(wx), sx = Math.sin(wx), cy = Math.cos(wy), sy = Math.sin(wy), cz = Math.cos(lz), sz = Math.sin(lz);
  const m00 = cy * cz + sy * sx * sz, m01 = -cy * sz + sy * sx * cz, m02 = sy * cx;
  const m10 = cx * sz, m11 = cx * cz, m12 = -sx;
  const m20 = -sy * cz + cy * sx * sz, m21 = sy * sz + cy * sx * cz, m22 = cy * cx;
  const tk = Geometry.thickness * R, X = c.p.x, Y = c.p.y + bob * Math.sin(time * 1.25 + c.phase) * 1.2 * Math.min(1, R / 30);
  const ink = rgb(c.ink);
  const cut = o.hole === undefined;

  ctx.save();
  ctx.globalAlpha = Math.min(1, c.opacity);

  const disc = (z: number, r: number, flip = 1) => {
    ctx.save();
    ctx.transform(flip * m00, flip * m10, m01, m11, X + m02 * z, Y + m12 * z);
    ctx.moveTo(r, 0);
    ctx.arc(0, 0, r, 0, TAU);
    ctx.restore();
  };

  // The silhouette: both faces and the rim joining them.
  const dx = -m02 * tk, dy = -m12 * tk;
  let rim: [number, number][] | null = null;
  if (Math.hypot(dx, dy) > 0.5) {
    const a = -m00 * dy + m10 * dx, b = m01 * dy - m11 * dx, t0 = Math.atan2(-b, a);
    const pt = (th: number, z: number): [number, number] => [
      X + m00 * R * Math.cos(th) + m01 * R * Math.sin(th) + m02 * z,
      Y + m10 * R * Math.cos(th) + m11 * R * Math.sin(th) + m12 * z,
    ];
    rim = [pt(t0, tk / 2), pt(t0, -tk / 2), pt(t0 + Math.PI, -tk / 2), pt(t0 + Math.PI, tk / 2)];
  }
  if (cut) {
    // Hide anything already drawn behind this coin, part by part (opposite windings would cancel as one path).
    ctx.globalCompositeOperation = "destination-out";
    ctx.globalAlpha = 1;
    ctx.beginPath(); disc(tk / 2, R); ctx.fill();
    ctx.beginPath(); disc(-tk / 2, R); ctx.fill();
    if (rim) { ctx.beginPath(); ctx.moveTo(...rim[0]); for (let i = 1; i < 4; i++) ctx.lineTo(...rim[i]); ctx.closePath(); ctx.fill(); }
    ctx.globalAlpha = Math.min(1, c.opacity);
    ctx.globalCompositeOperation = "source-over";
  }
  // Filled part by part: as one path, opposite windings would cancel where the parts overlap.
  ctx.fillStyle = ink;
  ctx.beginPath(); disc(tk / 2, R); ctx.fill();
  ctx.beginPath(); disc(-tk / 2, R); ctx.fill();
  if (rim) {
    ctx.beginPath(); ctx.moveTo(...rim[0]); for (let i = 1; i < 4; i++) ctx.lineTo(...rim[i]); ctx.closePath();
    ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 0.6; ctx.stroke();
  }

  const holes = () => {
    if (cut) { ctx.globalCompositeOperation = "destination-out"; ctx.fillStyle = "#000"; }
    else ctx.fillStyle = o.hole!;
  };

  // Rim notches on the visible side of the edge.
  const amp = Math.hypot(m20, m21);
  if (amp > KAPPA + 0.02 && R > 11) {
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
    holes(); ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }

  // The face turned towards the viewer: a knocked-out ring holding the glyph.
  if (Math.abs(m22) > 0.035) {
    const sg = m22 >= 0 ? 1 : -1;
    ctx.beginPath(); disc((sg * tk) / 2, R * RING, sg);
    holes(); ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    if (Math.abs(m22) > 0.12 && R > 7) {
      ctx.save();
      ctx.transform(sg * m00, sg * m10, m01, m11, X + (m02 * sg * tk) / 2, Y + (m12 * sg * tk) / 2);
      ctx.scale(c.p.g, c.p.g);
      ctx.fillStyle = ink; ctx.strokeStyle = ink;
      if (sg < 0) { starPath(ctx, R * RING * 0.5); ctx.fill(); }
      else if (c.face?.startsWith("@")) {
        const k = (R * RING * 1.02) / 24;
        ctx.scale(k, k);
        ctx.translate(-12, -12);
        ctx.lineWidth = 2.1;
        ctx.lineCap = "round"; ctx.lineJoin = "round";
        ctx.stroke(iconPath(c.face.slice(1)));
      } else if (c.face) {
        const size = R * RING * (c.face.length > 2 ? 0.6 : c.face.length > 1 ? 0.72 : 0.95);
        ctx.font = `600 ${size}px ui-rounded, "SF Pro Rounded", system-ui, -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(c.face, 0, size * 0.04);
      }
      ctx.restore();
    }
  }
  ctx.restore();
}

/** A requestAnimationFrame loop that sleeps while `target` is off-screen or the tab is hidden. */
export function runLoop(target: Element, frame: (dt: number, time: number) => boolean | void) {
  let raf = 0, last = 0, time = 0, visible = true, stopped = false;
  const tick = (now: number) => {
    raf = 0;
    if (stopped) return;
    const dt = last ? Math.min(Math.max((now - last) / 1000, 0), 1 / 20) : 1 / 60;
    last = now;
    time += dt;
    const keep = frame(dt, time) !== false;
    if (visible && keep) raf = requestAnimationFrame(tick);
  };
  const wake = () => {
    if (!raf && visible && !stopped) { last = 0; raf = requestAnimationFrame(tick); }
  };
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting && !document.hidden;
    if (visible) wake();
  }, { rootMargin: "120px" });
  io.observe(target);
  const onVis = () => { visible = !document.hidden; if (visible) wake(); };
  document.addEventListener("visibilitychange", onVis);
  wake();
  return {
    wake,
    stop() { stopped = true; if (raf) cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener("visibilitychange", onVis); },
  };
}

/** Sizes a canvas to its CSS box at device pixel ratio and returns a cleared context in CSS pixels. */
export function fitCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = canvas.clientWidth, height = canvas.clientHeight;
  const w = Math.round(width * dpr), h = Math.round(height * dpr);
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isDark() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (u: number) => { const x = clamp(u); return x * x * (3 - 2 * x); };
export const easeInOutCubic = (u: number) => { const x = clamp(u); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const easeOutCubic = (u: number) => 1 - Math.pow(1 - clamp(u), 3);

let probe: CanvasRenderingContext2D | null = null;
/** Resolves a CSS colour (including a custom property such as `var(--tool-income)`) on `el` to RGB. */
export function cssColor(el: Element, value: string): RGB {
  const v = value.startsWith("var(") ? getComputedStyle(el).getPropertyValue(value.slice(4, -1)).trim() : value;
  probe ??= document.createElement("canvas").getContext("2d");
  probe!.fillStyle = "#000";
  probe!.fillStyle = v;
  const s = String(probe!.fillStyle);
  if (s.startsWith("#")) return hex(s);
  const m = s.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
  return [m[0], m[1], m[2]];
}

/** Runs `fn` now and whenever the colour scheme changes. */
export function onSchemeChange(fn: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", fn);
  return () => mq.removeEventListener("change", fn);
}
