// The story's coin choreography: a port of OnboardingCoinStage.swift and PersonalisingView.swift, driven by the
// story's beats instead of onboarding steps. All positions are in the sticky stage's CSS pixels; `k` is the phone's
// scale, so point sizes from the app are multiplied by it.

import { bezier, keyframes } from "@/lib/coins/easing";
import {
  Coin, Geometry, Stars, TAU, clamp, drawCoin, easeInOutCubic, hex, lerp, rand, starPath, type Face, type RGB,
} from "@/lib/coins/engine";

export type BeatId = "hero" | "morph" | "welcome" | "q0" | "q1" | "q2" | "personalising" | "home" | "estimate" | "result";
export type Rect = { x: number; y: number; w: number; h: number };
export type Env = {
  width: number;
  height: number;
  k: number;
  m: number;
  dark: boolean;
  hero?: Rect;
  welcome?: Rect;
  heroSlot?: Rect;
  stackSlot?: Rect;
  logo?: Rect;
  screen?: Rect;
  pointer: { x: number; y: number; active: boolean };
};

const INK = {
  launch: { light: hex("#000000"), dark: hex("#f5f5f5") },
  green: { light: hex("#1d4a2a"), dark: hex("#6fd49a") },
  gold: { light: hex("#8d6618"), dark: hex("#e7bd5e") },
  white: hex("#ffffff"),
};
const ink = (name: "launch" | "green" | "gold", dark: boolean): RGB => INK[name][dark ? "dark" : "light"];

const FACES: Record<string, { before: Face; after: Face; ink: "green" | "gold" }> = {
  q0: { before: "@user", after: "@square-user", ink: "green" },
  q1: { before: "@map", after: "@map-pin", ink: "green" },
  q2: { before: "@target", after: "@target", ink: "gold" },
};
const Q_INDEX: Partial<Record<BeatId, number>> = { q0: 0, q1: 1, q2: 2 };

type Flood = { r: number; from: number; to: number; t: number; dur: number; running: boolean; opening: boolean; centre: () => { x: number; y: number } };

export type PersonalisePhase = "covered" | "text" | "untext" | "landing" | "done";

export class StoryStage {
  front = new Coin();
  back = new Coin();
  stack = [new Coin(), new Coin()];
  sats = [new Coin(), new Coin(), new Coin()];
  coins = [this.front, this.back, ...this.stack, ...this.sats];
  stars = new Stars();
  reduce = false;

  beat: BeatId = "hero";
  time = 0;
  env!: Env;
  private scheduled: { at: number; run: () => void }[] = [];
  private jitter = this.stack.map(() => ({ x: rand(-2, 2), lz: rand(-0.14, 0.14), wy: rand(-0.05, 0.05) }));
  private satPhase = 0;
  private satCount = 0;
  private stackCount = 0;
  private twinkleIn = 2.4;
  private inkDelayed: RGB | null = null;
  private pairOpacity = 1;
  /** A diagonal band of light sweeping across the pair (the original launch animation's sheen). */
  private sheen = { t: -1, dur: 1.4, colour: "255 255 255", alpha: 0.75 };
  private sheenIn = 5;
  private playSheen(colour: string, alpha: number) { if (!this.reduce) this.sheen = { t: 0, dur: 1.4, colour, alpha }; }

  /** The intro: the launch (coins meet, stars pop), then the flood opens from the pair as it rises into the hero. */
  intro: { phase: "none" | "launch" | "flood"; t: number; centre: { x: number; y: number }; height: number; box: { x: number; y: number; h: number } } = { phase: "none", t: 0, centre: { x: 0, y: 0 }, height: 0, box: { x: 0, y: 0, h: 0 } };
  /** The hero flood's radius during the intro (stage pixels, centred on the pair), or null once it covers the stage. */
  heroFloodRadius: number | null = null;
  heroFloodCentre = { x: 0, y: 0 };
  /** The phone's own green, in stage pixels. */
  flood: Flood = { r: 0, from: 0, to: 0, t: 0, dur: 1, running: false, opening: false, centre: () => ({ x: 0, y: 0 }) };

  personalise = { running: false, t: 0, speed: 1, fired: new Set<PersonalisePhase>() };
  onPersonalise: (phase: PersonalisePhase) => void = () => {};
  onIntro: (phase: "launch" | "flood" | "done") => void = () => {};

  constructor() {
    this.front.z = 10;
    this.back.z = 0;
    this.stack.forEach((c, i) => { c.z = i + 1; c.idle = false; });
    this.sats.forEach((c) => { c.idle = false; });
  }

  private after(delay: number, run: () => void) { this.scheduled.push({ at: this.time + delay, run }); }
  private get k() { return this.env.k; }
  private get dark() { return this.env.dark; }

  /* Placements */

  private place(r: Rect | undefined, height: number) {
    const cx = r ? r.x + r.w / 2 : this.env.width / 2, cy = r ? r.y + r.h / 2 : this.env.height / 2;
    return Geometry.artCoins(cx, cy, height);
  }
  heroBox() {
    const r = this.env.hero;
    return r ? { x: r.x + r.w / 2, y: r.y + r.h / 2, h: Math.min(r.h, r.w * 1.02) * 0.8 } : { x: this.env.width / 2, y: this.env.height / 2, h: 300 };
  }
  heroPlace() { const b = this.heroBox(); return Geometry.artCoins(b.x, b.y, b.h); }
  welcomePlace() { return this.place(this.env.welcome, 112 * this.k); }
  logoPlace() { return this.place(this.env.logo, 40 * this.k); }
  private loaderCentre() {
    const s = this.env.screen;
    return s ? { x: s.x + s.w / 2, y: s.y + s.h * 0.4 } : { x: this.env.width / 2, y: this.env.height / 2 };
  }
  private loaderPlace() { const c = this.loaderCentre(); return Geometry.artCoins(c.x, c.y, 150 * this.k); }
  private slot(r?: Rect) { return r ? { x: r.x + r.w / 2, y: r.y + r.h / 2 } : { x: this.front.p.x, y: this.front.p.y }; }

  private setPair(p: ReturnType<typeof Geometry.artCoins>, snap = false) {
    if (snap) { this.front.snap(p.front.x, p.front.y, p.scale); this.back.snap(p.back.x, p.back.y, p.scale); }
    else { this.front.place(p.front.x, p.front.y, p.scale); this.back.place(p.back.x, p.back.y, p.scale); }
  }
  private restPose(snap = false) {
    if (snap) { this.front.snapAngles(Geometry.frontRest); this.back.snapAngles(Geometry.backRest); }
    else { this.front.pose(Geometry.frontRest); this.back.pose(Geometry.backRest); }
  }
  private allInk(c: RGB, snap = false) { for (const coin of this.coins) coin.setInk(c, snap); }

  /* Flood */

  private floodFull(c: { x: number; y: number }) {
    const s = this.env.screen;
    if (!s) return 2000;
    return Math.max(Math.hypot(c.x - s.x, c.y - s.y), Math.hypot(c.x - s.x - s.w, c.y - s.y), Math.hypot(c.x - s.x, c.y - s.y - s.h), Math.hypot(c.x - s.x - s.w, c.y - s.y - s.h)) + 4;
  }
  private openFlood(centre: () => { x: number; y: number }, dur: number) {
    const to = this.floodFull(centre());
    this.flood = { r: this.flood.r, from: this.flood.r, to, t: 0, dur, running: !this.reduce, opening: true, centre };
    if (this.reduce) this.flood.r = to;
  }
  private closeFlood(centre: () => { x: number; y: number }, dur: number) {
    const from = Math.min(this.flood.r, this.floodFull(centre()));
    this.flood = { r: from, from, to: 0, t: 0, dur, running: !this.reduce, opening: false, centre };
    if (this.reduce) this.flood.r = 0;
  }
  private frontCentre = () => ({ x: this.front.p.x, y: this.front.p.y });
  private logoCentre = () => { const l = this.env.logo; return l ? { x: l.x + l.w / 2, y: l.y + l.h / 2 } : this.frontCentre(); };

  /* Intro */

  private static pace = 0.765;
  private static contact = 0.96 * StoryStage.pace;
  private static approach = keyframes(1, [[0, StoryStage.contact, bezier(0.5, 0.2, 0.9, 0.55)]]);
  private static drop = keyframes(0, [[45, StoryStage.contact, bezier(0.5, 0.2, 0.9, 0.55)], [-14, 0.288 * StoryStage.pace, bezier(0.4, 0, 0.5, 1)], [0, 0.352 * StoryStage.pace, bezier(0.4, 0, 0.5, 1)]]);
  private static pop = (d: number) => keyframes(0, [[0, d * StoryStage.pace], [1, 0.8 * StoryStage.pace, bezier(0.2, 0.9, 0.3, 1.25)]]);
  private static fade = (d: number) => keyframes(0, [[0, d * StoryStage.pace], [1, 0.48 * StoryStage.pace, bezier(0.2, 0.9, 0.3, 1.25)]]);
  private static upperPop = StoryStage.pop(1.4);
  private static lowerPop = StoryStage.pop(1.65);
  private static upperFade = StoryStage.fade(1.4);
  private static lowerFade = StoryStage.fade(1.65);
  private static launchEnd = (1.65 + 0.8) * StoryStage.pace;
  private artStars = { opacity: 0, upper: 0, lower: 0 };

  startIntro(env: Env) {
    this.env = env;
    const h = Math.min(env.width, env.height) * (env.width < 700 ? 0.42 : 0.3);
    this.intro = { phase: "launch", t: 0, centre: { x: env.width / 2, y: env.height / 2 }, height: h, box: { x: env.width / 2, y: env.height / 2, h } };
    this.heroFloodRadius = 0;
    this.allInk(ink("launch", env.dark), true);
    this.onIntro("launch");
  }
  /** Jumps to the end of the intro (the visitor scrolled, or it's not the first visit). */
  finishIntro() {
    if (this.intro.phase === "none") return;
    this.intro.phase = "none";
    this.heroFloodRadius = null;
    this.setPair(this.heroPlace(), true);
    this.restPose(true);
    this.allInk(INK.white, true);
    this.artStars.opacity = 0;
    this.onIntro("done");
  }

  private tickIntro(dt: number) {
    const it = this.intro;
    it.t += dt;
    const launch = Geometry.artCoins(it.centre.x, it.centre.y, it.height);
    if (it.phase === "launch") {
      const t = it.t;
      // Far enough that the front coin starts above the stage and the back coin below it.
      const travel = this.env.height / 2 + it.height;
      const offset = StoryStage.drop(t) * (it.height / 1457) - StoryStage.approach(t) * travel;
      this.front.snap(launch.front.x, launch.front.y + offset, launch.scale);
      this.back.snap(launch.back.x, launch.back.y - offset, launch.scale);
      this.restPose(true);
      this.front.idle = this.back.idle = false;
      this.artStars = { opacity: Math.min(StoryStage.upperFade(t), 1), upper: StoryStage.upperPop(t), lower: StoryStage.lowerPop(t) };
      if (t >= StoryStage.contact + 0.45 && this.sheen.t < 0 && it.phase === "launch") this.playSheen(this.dark ? "0 0 0" : "255 255 255", this.dark ? 0.5 : 0.75);
      if (t >= StoryStage.launchEnd) {
        it.phase = "flood"; it.t = 0;
        this.onIntro("flood");
      }
      return;
    }
    // The pair rises into the hero as the green floods out from it; its ink turns white with the flood.
    const hb = this.heroBox();
    const e = easeInOutCubic(it.t / 1.5);
    it.box = { x: lerp(it.centre.x, hb.x, e), y: lerp(it.centre.y, hb.y, e), h: lerp(it.height, hb.h, e) };
    const now = Geometry.artCoins(it.box.x, it.box.y, it.box.h);
    this.front.snap(now.front.x, now.front.y, now.scale);
    this.back.snap(now.back.x, now.back.y, now.scale);
    this.heroFloodCentre = { x: (now.front.x + now.back.x) / 2, y: (now.front.y + now.back.y) / 2 };
    const full = Math.hypot(Math.max(this.heroFloodCentre.x, this.env.width - this.heroFloodCentre.x), Math.max(this.heroFloodCentre.y, this.env.height - this.heroFloodCentre.y)) + 4;
    const r = full * easeInOutCubic(it.t / 1.1);
    this.heroFloodRadius = r;
    const white = clamp(r / (it.height * 0.75));
    const from = ink("launch", this.dark);
    const mixed: RGB = [lerp(from[0], 255, white), lerp(from[1], 255, white), lerp(from[2], 255, white)];
    this.allInk(mixed, true);
    this.artStars.opacity = Math.max(0, 1 - it.t / 0.5);
    if (it.t >= 1.7) {
      it.phase = "none";
      this.heroFloodRadius = null;
      this.front.idle = this.back.idle = true;
      this.onIntro("done");
    }
  }

  /* Beats */

  /** Moves to a beat. Beats skipped over (a fast scroll, a jump link) are passed through and settled instantly. */
  setBeat(next: BeatId) {
    const from = order(this.beat), to = order(next);
    if (from === to) return;
    const step = to > from ? 1 : -1;
    for (let i = from + step; i !== to; i += step) {
      this.enter(ORDER[i]);
      this.settle();
    }
    this.enter(next);
  }

  /** Finishes everything in flight: scheduled reactions, floods, the personalising sequence and the springs. */
  private settle() {
    const due = this.scheduled; this.scheduled = [];
    due.forEach((s) => s.run());
    if (this.personalise.running) this.landNow();
    if (this.flood.running) { this.flood.r = this.flood.to; this.flood.running = false; }
    if (this.inkDelayed) { this.allInk(this.inkDelayed, true); this.inkDelayed = null; }
    this.layout(0);
    for (const c of this.coins) {
      c.flight = null;
      c.p = { ...c.t };
      c.v = { x: 0, y: 0, s: 0, wx: 0, wy: 0, lz: 0, g: 0 };
      c.ink = [...c.inkTarget];
    }
    this.stars.clear();
  }

  private enter(next: BeatId) {
    const prev = this.beat;
    if (next === prev) return;
    this.beat = next;
    const qi = Q_INDEX[next], pq = Q_INDEX[prev];
    const forward = order(next) > order(prev);

    // Leaving the logo's screens.
    this.pairOpacity = next === "estimate" || next === "result" ? 0 : 1;

    if (next === "hero" || next === "morph") {
      this.front.kp = this.back.kp = [90, 16];
      this.back.t.s = this.front.t.s;
      this.restPose();
      this.allInk(INK.white);
      this.abortPersonalise();
      return;
    }

    if (next === "welcome") {
      this.abortPersonalise();
      if (prev === "morph" || prev === "hero") {
        const centre = () => this.welcomeMid();
        this.flood = { r: this.floodFull(centre()), from: 0, to: 0, t: 0, dur: 1, running: false, opening: true, centre };
        this.allInk(INK.white, true);
        return;
      }
      // Back from the questions: the back coin grows out of the hero on its way back into the pair.
      this.back.p.x = this.front.p.x; this.back.p.y = this.front.p.y; this.back.p.s = 0.05 * this.k; this.back.copyAngles(this.front);
      this.front.kr = this.back.kr = [80, 15]; this.front.ks = this.back.ks = [110, 17]; this.front.kp = this.back.kp = [60, 14];
      this.front.setFace(null, false); this.back.setFace(null, false);
      this.restPose();
      this.stackCount = 0; this.satCount = 0;
      this.allInk(INK.white);
      this.openFlood(() => this.welcomeMid(), 0.8);
      return;
    }

    if (qi !== undefined) {
      const faces = FACES[next];
      if (prev === "welcome" || prev === "morph" || prev === "hero") {
        // The back coin merges into the hero as the green drains away towards it.
        this.back.t.s = 0; this.back.ks = [160, 14]; this.back.kp = [140, 14];
        this.inkDelayed = ink(faces.ink, this.dark);
        this.closeFlood(this.frontCentre, 0.62);
        this.after(0.42, () => this.stars.burst(this.front.p.x, this.front.p.y, 6, 120 * this.k, [3 * this.k, 6 * this.k]));
      } else if (prev === "personalising" || prev === "home" || prev === "estimate" || prev === "result") {
        this.abortPersonalise();
        this.back.t.s = 0; this.back.ks = [200, 24];
        for (const c of [...this.stack, ...this.sats]) c.flight = null;
        this.inkDelayed = ink(faces.ink, this.dark);
        this.closeFlood(this.frontCentre, 0.4);
        if (this.flood.r < 1) { this.allInk(ink(faces.ink, this.dark)); this.inkDelayed = null; }
      } else {
        this.allInk(ink(faces.ink, this.dark));
      }
      this.front.kp = [90, 16]; this.front.kr = [100, 17]; this.front.ks = [150, 19]; this.front.idle = true;
      this.front.pose({ wx: 0.1, wy: 0.18, lz: 0 });
      // The previous step's coin drops onto the stack.
      if (forward && pq !== undefined && pq === qi - 1) this.dropOntoStack(pq);
      if (!forward && pq !== undefined) for (let i = qi; i < this.stack.length; i++) this.stack[i].ks = [200, 24];
      this.stackCount = qi;
      if (qi !== 2) this.satCount = 0;
      const axisX = qi % 2 === 0;
      if (!this.reduce) {
        if (axisX) this.front.t.wx += TAU * (forward ? 1 : -1); else this.front.t.wy += TAU * (forward ? 1 : -1);
        this.front.v.y -= 100 * this.k;
      }
      this.after(this.reduce ? 0 : 0.15, () => this.front.setFace(faces.before));
      return;
    }

    if (next === "personalising") {
      if (prev === "home" || prev === "estimate" || prev === "result") return; // Coming back up: stay landed.
      this.startPersonalise();
      return;
    }

    if (next === "home" || next === "estimate" || next === "result") {
      // Scrolled on before it finished: on the home screen let it finish a little quicker; past it, land at once.
      if (this.personalise.running && next === "home") { this.personalise.speed = 1.4; return; }
      if (this.personalise.running) { this.landNow(); this.onPersonalise("done"); return; }
      if (order(prev) < order("personalising")) this.landNow();
    }
  }

  /** A pick on the current question: the hero coin reacts (and, for goals, a satellite joins). */
  pick(n: number) {
    const q = this.beat;
    if (!(q in FACES)) return;
    if (q === "q2") {
      this.satCount = n;
      if (!this.reduce) { this.front.v.wy += 3; this.front.v.y -= 55 * this.k; }
      if (n === 3) this.stars.sparkle(this.front, 2, undefined);
      return;
    }
    this.front.setFace(FACES[q].after);
    if (!this.reduce) { this.front.v.wy += 3.2 * (Math.random() < 0.5 ? -1 : 1); this.front.v.y -= 60 * this.k; this.front.v.s += 1 * this.k; }
  }

  private welcomeMid() { const w = this.env.welcome; return w ? { x: w.x + w.w / 2, y: w.y + w.h / 2 } : this.frontCentre(); }

  private dropOntoStack(i: number) {
    const c = this.stack[i];
    c.flight = null;
    c.snap(this.front.p.x, this.front.p.y, this.front.p.s * 0.8);
    c.copyAngles(this.front);
    c.pose({ wx: Geometry.lying, wy: this.jitter[i].wy, lz: this.jitter[i].lz });
    c.kr = [80, 18]; c.kp = [150, 25]; c.ks = [170, 26];
    c.face = null;
    c.setInk(this.front.ink, true);
  }

  /* Personalising: the green covers the page, the coins gather into the pair, which orbits like the loader,
     then flies into the home screen's logo. */

  private startPersonalise() {
    this.personalise = { running: true, t: 0, speed: 1, fired: new Set() };
    this.openFlood(this.frontCentre, 0.6);
    this.allInk(INK.white);
    for (const c of this.coins) c.inkRate = 5;
    this.inkDelayed = null;
  }
  private abortPersonalise() {
    if (!this.personalise.running) return;
    this.personalise.running = false;
    for (const c of this.coins) c.inkRate = 6;
  }
  private landNow() {
    this.personalise.running = false;
    this.flood.r = 0; this.flood.running = false;
    this.setPair(this.logoPlace(), true);
    this.restPose(true);
    this.allInk(ink("launch", this.dark), true);
    this.stackCount = 0; this.satCount = 0;
    for (const c of [...this.stack, ...this.sats]) { c.t.s = 0; c.p.s = 0; }
    this.front.idle = this.back.idle = false;
    this.front.setFace(null, false);
  }

  private tickPersonalise(dt: number) {
    const P = this.personalise;
    P.t += dt * P.speed;
    const t = P.t;
    const fire = (phase: PersonalisePhase) => { if (!P.fired.has(phase)) { P.fired.add(phase); this.onPersonalise(phase); } };
    const lp = this.loaderPlace();
    if (t < 0.35) return;
    if (t < 0.9) {
      if (!P.fired.has("covered") && t >= 0.55) fire("covered");
      // Gather: the back coin grows out of the hero, the stack and satellites fly into the middle.
      if (this.back.t.s === 0 || this.back.p.s < 0.01) {
        this.back.p.x = this.front.p.x; this.back.p.y = this.front.p.y; this.back.p.s = 0.05 * this.k; this.back.copyAngles(this.front);
      }
      this.front.setFace(null, false);
      this.front.kp = this.back.kp = [60, 14]; this.front.ks = this.back.ks = [110, 17]; this.front.kr = this.back.kr = [80, 15];
      this.setPair(lp);
      this.restPose();
      const c = this.loaderCentre();
      for (const coin of [...this.stack, ...this.sats]) { coin.place(c.x, c.y, 0); coin.kp = [120, 18]; coin.ks = [60, 14]; }
      this.stackCount = 0; this.satCount = 0;
      if (t >= 0.8 && !P.fired.has("text")) { this.stars.burst(c.x, c.y, 6, 150 * this.k, [3 * this.k, 6 * this.k]); fire("text"); }
      return;
    }
    if (t < 2.1) {
      // The loader: the pair swaps places about its midpoint, a half-turn every 0.6 s, the front coin staying in front.
      const u = (t - 0.9) / 0.6, swaps = Math.floor(u), theta = (swaps + easeInOutCubic(u - swaps)) * Math.PI;
      const mid = { x: (lp.front.x + lp.back.x) / 2, y: (lp.front.y + lp.back.y) / 2 };
      const rot = (p: { x: number; y: number }) => {
        const x = p.x - mid.x, y = p.y - mid.y, c = Math.cos(theta), s = Math.sin(theta);
        return { x: mid.x + x * c - y * s, y: mid.y + x * s + y * c };
      };
      const a = rot(lp.front), b = rot(lp.back);
      this.front.snap(a.x, a.y, lp.scale); this.back.snap(b.x, b.y, lp.scale);
      this.restPose(true);
      if (t > 1.95) fire("untext");
      return;
    }
    // Land in the logo.
    fire("landing");
    const u = clamp((t - 2.1) / 0.7), e = easeInOutCubic(u);
    const to = this.logoPlace();
    const arc = Math.sin(Math.PI * u) * 36 * this.k;
    this.front.snap(lerp(lp.front.x, to.front.x, e), lerp(lp.front.y, to.front.y, e) - arc, lerp(lp.scale, to.scale, e));
    this.back.snap(lerp(lp.back.x, to.back.x, e), lerp(lp.back.y, to.back.y, e) - arc, lerp(lp.scale, to.scale, e));
    if (t >= 2.22 && this.flood.opening) this.closeFlood(this.logoCentre, 0.5);
    if (t >= 2.45) this.allInk(ink("launch", this.dark));
    if (u >= 1) {
      P.running = false;
      for (const c of this.coins) c.inkRate = 6;
      this.front.idle = this.back.idle = false;
      const s = Geometry.artCoins(this.logoCentre().x, this.logoCentre().y, 40 * this.k).stars;
      this.stars.add(s.upper.x, s.upper.y, { r: 6 * this.k, max: 1.1, drag: 50 });
      this.after(0.18, () => this.stars.add(s.lower.x, s.lower.y, { r: 5 * this.k, max: 1.1, drag: 50 }));
      this.playSheen(this.dark ? "0 0 0" : "255 255 255", 0.6);
      fire("done");
    }
  }

  /* Taps */

  /** A tap at a stage point. Returns true when it hit the coins. */
  tap(x: number, y: number) {
    const hit = [this.front, this.back].some((c) => c.p.s > 0.02 && this.pairOpacity > 0.5 && Math.hypot(c.p.x - x, c.p.y - y) < 100 * c.p.s * 1.25 + 8);
    if (!hit || this.intro.phase !== "none" || this.personalise.running) return false;
    if (Q_INDEX[this.beat] !== undefined) {
      if (!this.reduce) { this.front.t.wy += TAU; this.front.v.y -= 200 * this.k; }
      this.stars.sparkle(this.front, 3);
      return true;
    }
    this.spinPair();
    return true;
  }

  /** The home logo's tap: the coins spin a full turn, the top one first, with a hop; the launch stars twinkle. */
  spinPair() {
    const k = (100 * this.front.p.s) / 52;
    const place = this.beat === "hero" || this.beat === "morph" ? this.heroPlace() : this.beat === "welcome" ? this.welcomePlace() : this.logoPlace();
    if (!this.reduce) {
      this.front.kp = this.back.kp = [150, 16]; this.front.kr = this.back.kr = [100, 17];
      this.front.t.wy += TAU; this.front.v.y -= 70 * k;
      this.after(0.09, () => { this.back.t.wy -= TAU; this.back.v.y -= 55 * k; });
    }
    const s = place.stars;
    this.after(0.2, () => this.stars.add(s.upper.x, s.upper.y, { r: 6 * k * 1.4, max: 1.2, drag: 50 }));
    this.after(0.38, () => this.stars.add(s.lower.x, s.lower.y, { r: 5 * k * 1.4, max: 1.2, drag: 50 }));
  }

  /* Frame */

  frame(dt: number, env: Env) {
    this.env = env;
    this.time += dt;
    this.stars.reduceMotion = this.reduce;
    const due = this.scheduled.filter((s) => s.at <= this.time);
    this.scheduled = this.scheduled.filter((s) => s.at > this.time);
    due.forEach((s) => s.run());

    if (this.sheen.t >= 0) { this.sheen.t += dt; if (this.sheen.t > this.sheen.dur) this.sheen.t = -1; }
    if (this.intro.phase !== "none") { this.tickIntro(dt); this.stars.update(dt); return; }
    this.layout(dt);
    for (const c of this.coins) c.update(dt);
    this.tickFlood(dt);
    if (this.personalise.running) this.tickPersonalise(dt);
    this.stars.update(dt);
    for (const c of [this.front, this.back]) c.opacity += ((this.pairOpacity) - c.opacity) * Math.min(1, dt * 14);
  }

  private tickFlood(dt: number) {
    const f = this.flood;
    if (f.running) {
      f.t += dt;
      const u = clamp(f.t / f.dur);
      f.r = f.opening ? lerp(f.from, f.to, easeInOutCubic(u)) : f.from * Math.pow(1 - u, 1.35);
      if (u >= 1) { f.running = false; f.r = f.to; }
    }
    if (this.inkDelayed && f.r < 120 * this.k) { this.allInk(this.inkDelayed); this.inkDelayed = null; }
  }
  floodCentre() { return this.flood.centre(); }

  private layout(dt: number) {
    const b = this.beat;
    if (b === "hero" || (b === "morph" && this.env.m <= 0.001)) {
      // The pair floats as one: no per-coin bob or pointer tilt, so the two coins never shift against each other.
      const p = this.heroPlace(), f = this.float(p.scale);
      this.front.place(p.front.x, p.front.y + f, p.scale);
      this.back.place(p.back.x, p.back.y + f, p.scale);
      this.front.pose(Geometry.frontRest); this.back.pose(Geometry.backRest);
      this.front.idle = this.back.idle = false;
      this.twinkle(dt, p);
    } else if (b === "morph") {
      // Scrubbed: the pair shrinks from the hero into the phone's welcome space.
      const a = this.heroPlace(), w = this.welcomePlace(), e = easeInOutCubic(clamp(this.env.m / 0.8));
      this.front.snap(lerp(a.front.x, w.front.x, e), lerp(a.front.y, w.front.y, e), lerp(a.scale, w.scale, e));
      this.back.snap(lerp(a.back.x, w.back.x, e), lerp(a.back.y, w.back.y, e), lerp(a.scale, w.scale, e));
      this.front.pose(Geometry.frontRest); this.back.pose(Geometry.backRest);
    } else if (b === "welcome") {
      const w = this.welcomePlace(), f = this.float(w.scale);
      this.front.place(w.front.x, w.front.y + f, w.scale);
      this.back.place(w.back.x, w.back.y + f, w.scale);
      this.front.idle = this.back.idle = false;
      this.twinkle(dt, w);
    } else if (Q_INDEX[b] !== undefined) {
      this.layoutQuestion(dt);
    } else if (!this.personalise.running && (b === "home" || b === "estimate" || b === "result" || b === "personalising")) {
      const l = this.logoPlace();
      this.front.kp = this.back.kp = [150, 16];
      this.setPair(l);
    }
  }

  private layoutQuestion(dt: number) {
    const hero = this.slot(this.env.heroSlot);
    this.front.place(hero.x, hero.y, 0.29 * this.k);
    if (this.back.t.s === 0) { this.back.t.x = this.front.p.x; this.back.t.y = this.front.p.y; }
    const size = 0.16 * this.k, r0 = 100 * size, lie = Geometry.lying, thick = Geometry.thickness;
    const ss = this.env.stackSlot;
    const rise = thick * r0 * 1.12 * Math.sin(lie);
    const baseY = ss ? ss.y + ss.h - r0 * Math.cos(lie) - 0.5 * thick * r0 * Math.sin(lie) - 4 * this.k : hero.y;
    const sx = ss ? ss.x + ss.w / 2 : hero.x + 200;
    this.stack.forEach((c, i) => {
      if (i < this.stackCount) { c.place(sx + this.jitter[i].x * this.k, baseY - i * rise, size); c.idle = false; }
      else { c.place(this.front.p.x, this.front.p.y, 0); c.ks = [320, 36]; c.kp = [220, 30]; }
    });
    // One small coin orbits the hero for each goal picked.
    this.satPhase += dt * 1.5;
    const n = this.beat === "q2" ? this.satCount : 0;
    this.sats.forEach((c, i) => {
      if (i < n) {
        const a = this.satPhase + (i * TAU) / Math.max(n, 1);
        c.place(this.front.p.x + Math.cos(a) * 44 * this.k, this.front.p.y + Math.sin(a) * 19 * this.k, 0.12 * this.k);
        c.z = Math.sin(a) > 0 ? 24 : 6; c.kp = [200, 22]; c.ks = [160, 14];
        if (c.p.s < 0.001) { c.p.x = this.front.p.x; c.p.y = this.front.p.y; c.face = null; }
      } else { c.place(this.front.p.x, this.front.p.y, 0); c.ks = [260, 30]; }
    });
    this.front.z = 20;
  }

  /** A slow shared rise and fall for the pair, a few percent of a coin's radius. */
  private float(scale: number) { return this.reduce ? 0 : Math.sin(this.time * 0.85) * scale * 100 * 0.045; }

  private twinkle(dt: number, p: ReturnType<typeof Geometry.artCoins>) {
    if (this.reduce) return;
    this.sheenIn -= dt;
    if (this.sheenIn <= 0) { this.sheenIn = 7.2; this.playSheen("221 173 68", 0.9); }
    this.twinkleIn -= dt;
    if (this.twinkleIn > 0) return;
    this.twinkleIn = 3.6;
    const r = p.scale * 100 / 52;
    this.stars.add(p.stars.upper.x, p.stars.upper.y, { r: 9 * r, max: 1.6, drag: 50 });
    this.after(0.26, () => this.stars.add(p.stars.lower.x, p.stars.lower.y, { r: 7 * r, max: 1.6, drag: 50 }));
  }

  /* Draw */

  draw(ctx: CanvasRenderingContext2D) {
    const opts = { time: this.time, reduceMotion: this.reduce };
    const visible = this.coins.filter((c) => c.p.s > 0.004).sort((a, b) => a.z - b.z);
    for (const c of visible) drawCoin(ctx, c, opts);
    if (this.sheen.t >= 0) this.drawSheen(ctx);
    const starInk = `rgb(${this.front.ink.map((v) => v.toFixed(0)).join(" ")})`;
    // The launch art's two stars, popping in as the coins land.
    if (this.intro.phase !== "none" && this.artStars.opacity > 0) {
      const placed = Geometry.artCoins(this.intro.box.x, this.intro.box.y, this.intro.box.h);
      const k = placed.k;
      const star = (x: number, y: number, r: number, pop: number) => {
        if (pop <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.min(1, this.artStars.opacity);
        ctx.translate(x, y); ctx.rotate((-120 * (1 - pop) * Math.PI) / 180); ctx.scale(pop, pop);
        starPath(ctx, r); ctx.fillStyle = starInk; ctx.fill();
        ctx.restore();
      };
      star(placed.stars.upper.x, placed.stars.upper.y, 135 * k, this.intro.phase === "flood" ? 1 : this.artStars.upper);
      star(placed.stars.lower.x, placed.stars.lower.y, 105 * k, this.intro.phase === "flood" ? 1 : this.artStars.lower);
    }
    const onGreen = this.beat === "hero" || this.beat === "morph" || this.beat === "welcome" || this.personalise.running;
    this.stars.draw(ctx, onGreen ? "#ddad44" : starInk);
  }

  /** Lights only the pixels already drawn (the coins), with a soft band sweeping diagonally across the pair. */
  private drawSheen(ctx: CanvasRenderingContext2D) {
    const pair = [this.front, this.back].filter((c) => c.p.s > 0.01);
    if (!pair.length) return;
    const r = Math.max(...pair.map((c) => 100 * c.p.s));
    const x0 = Math.min(...pair.map((c) => c.p.x)) - r * 1.3, x1 = Math.max(...pair.map((c) => c.p.x)) + r * 1.3;
    const y0 = Math.min(...pair.map((c) => c.p.y)) - r * 1.3, y1 = Math.max(...pair.map((c) => c.p.y)) + r * 1.3;
    const u = this.sheen.t / this.sheen.dur, e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
    const w = x1 - x0, h = y1 - y0, band = Math.max(w, h) * 0.32;
    const cx = x0 - band + (w + band * 2) * e;
    ctx.save();
    ctx.globalCompositeOperation = "source-atop";
    ctx.translate(cx, (y0 + y1) / 2);
    ctx.rotate(Math.PI / 4);
    const g = ctx.createLinearGradient(-band / 2, 0, band / 2, 0);
    g.addColorStop(0, `rgb(${this.sheen.colour} / 0)`);
    g.addColorStop(0.5, `rgb(${this.sheen.colour} / ${this.sheen.alpha})`);
    g.addColorStop(1, `rgb(${this.sheen.colour} / 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(-band / 2, -(w + h), band, (w + h) * 2);
    ctx.restore();
  }

  get isQuiet() {
    return this.intro.phase === "none" && this.sheen.t < 0 && !this.personalise.running && !this.flood.running && this.stars.isEmpty && this.scheduled.length === 0
      && this.coins.every((c) => c.p.s < 0.004 || c.isSettled) && this.beat !== "q2";
  }
}

const ORDER: BeatId[] = ["hero", "morph", "welcome", "q0", "q1", "q2", "personalising", "home", "estimate", "result"];
export const order = (b: BeatId) => ORDER.indexOf(b);
