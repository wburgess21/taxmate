"use client";

import { useEffect, useRef } from "react";
import { Coin, Geometry, Stars, cssVar, drawCoin, fitCanvas, prefersReducedMotion, rand, runLoop } from "@/lib/coins/engine";

/**
 * The onboarding coins: a hero coin showing the current step's glyph, flipping to each new one, above a stack that
 * gains a coin for every step reached. Steps are the `[data-step]` elements in the same section. On wide screens
 * the stack follows the reader's scroll; on narrow ones (where the stage isn't sticky) it plays through on its own.
 * The active step gets `data-active` so the list can highlight it.
 */
export function CoinStack({ faces }: { faces: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const section = canvas.closest("section")!;
    const steps = Array.from(section.querySelectorAll<HTMLElement>("[data-step]"));
    const reduce = prefersReducedMotion();
    const wide = window.matchMedia("(min-width: 1024px)");
    const sparks = new Stars();
    sparks.reduceMotion = reduce;

    const hero = new Coin();
    hero.z = 100;
    const stack = faces.map(() => {
      const c = new Coin();
      c.kp = [120, 15];
      return c;
    });
    const jitter = faces.map(() => ({ x: rand(-3, 3), lz: rand(-0.14, 0.14), wy: rand(-0.06, 0.06) }));

    let size = { width: 0, height: 0 };
    let active = -1;
    let shown = 0;
    let time = 0;
    const pending: { at: number; run: () => void }[] = [];
    const after = (delay: number, run: () => void) => pending.push({ at: time + delay, run });

    const geometry = () => {
      const R = Math.min(size.width * 0.2, size.height * 0.16);
      return {
        hero: { x: size.width / 2, y: size.height * 0.3, s: R / 100 },
        stackR: R * 0.92,
        slot: (i: number) => ({ x: size.width / 2 + jitter[i].x, y: size.height * 0.84 - i * R * 0.36 }),
      };
    };

    function layoutStatic() {
      const g = geometry();
      hero.place(g.hero.x, g.hero.y, g.hero.s);
      stack.forEach((c, i) => {
        if (i < shown) {
          const s = g.slot(i);
          c.place(s.x, s.y, g.stackR / 100);
        }
      });
    }

    function setActive(next: number) {
      if (next === active) return;
      const g = geometry();
      const forward = next > active;
      active = next;
      steps.forEach((el, i) => el.toggleAttribute("data-active", i === active));
      // Flip the hero coin to the new step's glyph, swapping the face as it passes edge-on.
      const face = faces[Math.max(0, active)];
      if (!reduce) {
        hero.t.wy += forward ? Math.PI * 2 : -Math.PI * 2;
        hero.v.y -= 260;
        after(0.16, () => hero.setFace(face));
      } else hero.setFace(face, false);
      // Grow or shrink the stack to match.
      const target = active + 1;
      while (shown < target) {
        const i = shown++, c = stack[i], s = g.slot(i);
        c.face = faces[i];
        c.snap(hero.p.x, hero.p.y, reduce ? g.stackR / 100 : hero.p.s * 0.9);
        c.snapAngles({ wx: hero.p.wx, wy: hero.p.wy, lz: 0 });
        c.z = i;
        c.place(s.x, s.y, g.stackR / 100);
        c.pose({ wx: Geometry.lying, wy: 0.15 + jitter[i].wy, lz: jitter[i].lz });
        if (reduce) { c.snap(s.x, s.y, g.stackR / 100); c.snapAngles({ wx: Geometry.lying, wy: 0.15 + jitter[i].wy, lz: jitter[i].lz }); }
        else after(0.42, () => sparks.burst(s.x, s.y - g.stackR * 0.2, 6, 170, [3, 7]));
      }
      while (shown > target) {
        const c = stack[--shown];
        c.flight = reduce ? null : { vx: rand(-80, 80), vy: -420, gravity: 1300, ax: rand(-4, 4), ay: rand(6, 10), az: rand(-3, 3) };
        if (reduce) { c.t.s = 0; c.p.s = 0; }
      }
      loop.wake();
    }

    // Wide screens: the step nearest the reading line (60% down the viewport) is active.
    const onScroll = () => {
      if (!wide.matches) return;
      const line = window.innerHeight * 0.6;
      let next = -1;
      steps.forEach((el, i) => { if (el.getBoundingClientRect().top < line) next = i; });
      setActive(Math.max(next, 0));
    };

    // Narrow screens: play the steps through while the stage is on screen, then knock the stack over and repeat.
    let autoplay: ReturnType<typeof setTimeout> | undefined;
    let onScreen = false;
    const tickAuto = () => {
      if (wide.matches || !onScreen) return;
      if (active >= faces.length - 1) {
        autoplay = setTimeout(() => { setActive(-1); setActive(0); autoplay = setTimeout(tickAuto, 1500); }, 2400);
      } else {
        setActive(active + 1);
        autoplay = setTimeout(tickAuto, 1500);
      }
    };
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      clearTimeout(autoplay);
      if (onScreen && !wide.matches) autoplay = setTimeout(tickAuto, active < 0 ? 300 : 1200);
    }, { threshold: 0.5 });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      const r = canvas.getBoundingClientRect();
      const first = size.width === 0;
      size = { width: r.width, height: r.height };
      layoutStatic();
      if (first) {
        const g = geometry();
        hero.snap(g.hero.x, g.hero.y, 0);
        hero.place(g.hero.x, g.hero.y, g.hero.s);
        hero.snapAngles({ wx: 0.3, wy: 0.45, lz: 0 });
        hero.face = faces[0];
        if (reduce) hero.snap(g.hero.x, g.hero.y, g.hero.s);
      }
      onScroll();
      loop.wake();
    });
    ro.observe(canvas);
    window.addEventListener("scroll", onScroll, { passive: true });
    const onMedia = () => { clearTimeout(autoplay); onScroll(); if (!wide.matches && onScreen) autoplay = setTimeout(tickAuto, 600); };
    wide.addEventListener("change", onMedia);

    const loop = runLoop(canvas, (dt, t) => {
      time = t;
      const due = pending.filter((p) => p.at <= time);
      for (let i = pending.length - 1; i >= 0; i--) if (pending[i].at <= time) pending.splice(i, 1);
      due.forEach((p) => p.run());
      hero.update(dt, size);
      // Hero coin returns to its resting lean after each flip.
      stack.forEach((c) => c.update(dt, size));
      sparks.update(dt);

      const { ctx, width, height } = fitCanvas(canvas);
      ctx.clearRect(0, 0, width, height);
      const ink = cssVar(canvas, "--coin-ink"), hole = cssVar(canvas, "--surface");
      // A soft shadow under the stack grounds it.
      const g = geometry();
      const base = g.slot(0);
      const grd = ctx.createRadialGradient(base.x, base.y + g.stackR * 0.45, 0, base.x, base.y + g.stackR * 0.45, g.stackR * 1.3);
      grd.addColorStop(0, "rgb(0 0 0 / 0.08)");
      grd.addColorStop(1, "rgb(0 0 0 / 0)");
      ctx.fillStyle = grd;
      ctx.fillRect(base.x - g.stackR * 1.5, base.y - g.stackR, g.stackR * 3, g.stackR * 2.2);

      [...stack].sort((a, b) => a.z - b.z).forEach((c) => drawCoin(ctx, c, time, ink, hole, reduce));
      drawCoin(ctx, hero, time, ink, hole, reduce);
      sparks.draw(ctx, cssVar(canvas, "--tool-claims"));
    });

    return () => {
      loop.stop();
      io.disconnect();
      ro.disconnect();
      clearTimeout(autoplay);
      window.removeEventListener("scroll", onScroll);
      wide.removeEventListener("change", onMedia);
    };
  }, [faces]);

  return <canvas ref={canvasRef} aria-hidden className="h-full w-full" />;
}
