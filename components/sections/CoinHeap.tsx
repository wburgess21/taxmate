"use client";

import { useEffect, useRef } from "react";
import { Coin, Geometry, Stars, TAU, drawCoin, fitCanvas, prefersReducedMotion, rand, runLoop } from "@/lib/coins/engine";

const FACES = ["£", "%", "@pound-sterling", "@calendar", "@briefcase", "@house", "@percent", "@piggy-bank", "@banknote", "VAT", "NI", "@star"];

/**
 * The closing card: coins rain in and settle into a heap along the bottom when it scrolls into view. Tapping a coin
 * flips it; tapping anywhere else tosses a new one into the air.
 */
export function CoinHeap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const card = canvas.parentElement!;
    const reduce = prefersReducedMotion();
    const stars = new Stars();
    stars.reduceMotion = reduce;
    const heap: Coin[] = [];
    const tossed: Coin[] = [];
    let size = { width: 0, height: 0 }, started = false, time = 0;
    const queue: { at: number; run: () => void }[] = [];

    // Heap slots: a loose mound in each lower corner, so the centred copy stays clear.
    const slots = () => {
      const W = size.width, H = size.height, R = Math.max(22, Math.min(46, W / 30));
      const out: { x: number; y: number; s: number; lying: boolean }[] = [];
      for (const side of [-1, 1]) {
        const cx = side < 0 ? W * 0.13 : W * 0.87;
        const rows = W < 640 ? 2 : 3;
        for (let row = 0; row < rows; row++) {
          const n = rows + 1 - row;
          for (let i = 0; i < n; i++) {
            const x = cx + (i - (n - 1) / 2) * R * 1.85 + rand(-4, 4);
            out.push({ x, y: H - R * 1.2 - row * R * 1.05, s: (R / 100) * rand(0.92, 1.05), lying: row === 0 || Math.random() < 0.4 });
          }
        }
        // One coin stands on its edge against each mound.
        out.push({ x: cx + side * -R * 2.8, y: H - R * 1.5, s: R / 100, lying: false });
      }
      return out;
    };

    const settle = (c: Coin, p: { x: number; y: number; s: number; lying: boolean }) => {
      c.place(p.x, p.y, p.s);
      if (p.lying) c.pose({ wx: Geometry.lying + rand(-0.1, 0.1), wy: rand(-0.4, 0.4), lz: rand(-0.3, 0.3) });
      else c.pose({ wx: rand(0.1, 0.35), wy: rand(-0.6, 0.6), lz: rand(-0.25, 0.25) });
    };

    const ro = new ResizeObserver(() => {
      size = { width: card.clientWidth, height: card.clientHeight };
      if (started) { const ss = slots(); heap.forEach((c, i) => ss[i] && settle(c, ss[i])); }
      loop.wake();
    });
    ro.observe(card);

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started) return;
      started = true;
      slots().forEach((p, i) => {
        const c = new Coin();
        c.face = FACES[i % FACES.length];
        c.setInk([255, 255, 255], true);
        c.idle = false;
        c.z = -p.y;
        heap.push(c);
        queue.push({ at: time + (reduce ? 0 : 0.06 * i + rand(0, 0.12)), run: () => {
          c.snap(p.x + rand(-30, 30), reduce ? p.y : -80 - rand(0, 160), p.s);
          c.snapAngles({ wx: rand(-1, 1), wy: rand(-2, 2), lz: rand(-1, 1) });
          c.kp = [70, 15]; c.kr = [60, 13];
          settle(c, p);
          if (!reduce) setTimeout(() => stars.burst(p.x, p.y, 2, 90, [3, 5], "#ddad44"), 900);
        } });
      });
      loop.wake();
    }, { threshold: 0.4 });
    io.observe(card);

    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button")) return;
      const r = card.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      const hit = [...heap].reverse().find((c) => Math.hypot(c.p.x - x, c.p.y - y) < 100 * c.p.s * 1.1);
      if (hit) {
        if (!reduce) { hit.t.wy += TAU; hit.v.y -= 220; }
        stars.burst(hit.p.x, hit.p.y, 6, 200, [3, 7], "#ddad44");
      } else if (!reduce) {
        const c = tossed.find((t) => !t.flight) ?? (tossed.length < 14 ? (tossed.push(new Coin()), tossed[tossed.length - 1]) : null);
        if (!c) return;
        c.face = FACES[Math.floor(Math.random() * FACES.length)];
        c.setInk([255, 255, 255], true);
        c.idle = false;
        c.z = 1000;
        c.snap(x, y, Math.max(22, Math.min(46, size.width / 30)) / 100);
        c.snapAngles({ wx: rand(0.2, 0.6), wy: rand(-1, 1), lz: rand(-0.3, 0.3) });
        c.flight = { vx: rand(-180, 180), vy: -rand(700, 900), gravity: 1700, ax: rand(-3, 3), ay: rand(10, 16) * (Math.random() < 0.5 ? 1 : -1), az: rand(-2, 2) };
        stars.burst(x, y, 5, 160, [3, 6], "#ddad44");
      }
      loop.wake();
    };
    card.addEventListener("click", onClick);

    const loop = runLoop(canvas, (dt, t) => {
      time = t;
      for (let i = queue.length - 1; i >= 0; i--) if (queue[i].at <= time) { queue[i].run(); queue.splice(i, 1); }
      heap.forEach((c) => c.update(dt, size));
      tossed.forEach((c) => c.flight && c.update(dt, size));
      stars.update(dt);
      const { ctx } = fitCanvas(canvas);
      for (const c of [...heap].sort((a, b) => a.t.y - b.t.y)) if (c.p.s > 0.004) drawCoin(ctx, c, { time, reduceMotion: reduce });
      for (const c of tossed) if (c.flight) drawCoin(ctx, c, { time, reduceMotion: reduce });
      stars.draw(ctx, "#ddad44");
      return queue.length > 0 || !stars.isEmpty || tossed.some((c) => c.flight) || !heap.every((c) => c.isSettled);
    });

    return () => { loop.stop(); ro.disconnect(); io.disconnect(); card.removeEventListener("click", onClick); };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
