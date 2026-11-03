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

    /**
     * A loose mound in each lower corner, so the centred copy stays clear. Each slot keeps its own pose, so a resize
     * moves the coins without reshuffling them. Bottom-row coins lie flat on the card's bottom edge.
     */
    type Slot = { side: number; row: number; i: number; n: number; jx: number; sf: number; lying: boolean; wx: number; wy: number; lz: number };
    const plan: Slot[] = [];
    const rowsFor = (W: number) => (W < 640 ? 2 : 3);
    for (const side of [-1, 1]) {
      for (let row = 0; row < 3; row++) {
        const n = 4 - row;
        for (let i = 0; i < n; i++) {
          const lying = row === 0 || Math.random() < 0.55;
          plan.push({ side, row, i, n, jx: rand(-3, 3), sf: rand(0.94, 1.04), lying,
            wx: lying ? Geometry.lying + rand(-0.08, 0.08) : rand(0.15, 0.35), wy: rand(-0.4, 0.4), lz: lying ? rand(-0.15, 0.15) : rand(-0.25, 0.25) });
        }
      }
    }
    const narrow = () => size.width < 640;
    const unit = () => (narrow() ? 26 : Math.max(22, Math.min(46, size.width / 30)));
    /** On phones each mound is a coin narrower, so the two sit apart in their corners. */
    const widthOf = (sl: { n: number }) => (narrow() ? sl.n - 1 : sl.n);
    /**
     * Each mound tucks into its corner: the outermost bottom coin's edge sits a few pixels in from the card's side,
     * just clear of the 36 px rounded corner (worked out for a lying coin's ellipse against the corner's arc).
     */
    const moundCentre = (side: number) => {
      const R = unit(), outer = R * 1.18 + Math.max(0, 36 - R) * 0.35, span = ((narrow() ? 3 : 4) - 1) / 2 * 1.86 * R;
      return side < 0 ? outer + span : size.width - outer - span;
    };
    /** Where a slot's coin rests: its lowest point on the card's bottom edge, or on the row below. */
    const restOf = (sl: Slot) => {
      const H = size.height, R = unit() * sl.sf;
      const cx = moundCentre(sl.side);
      // How far a coin reaches below its centre at this tilt: the face's half-height plus half its edge.
      const reach = R * Math.cos(sl.wx) + 0.5 * Geometry.thickness * R * Math.sin(sl.wx);
      const floorY = H - (R * Math.cos(Geometry.lying) + 0.5 * Geometry.thickness * R * Math.sin(Geometry.lying));
      return { x: cx + (sl.i - (widthOf(sl) - 1) / 2) * unit() * 1.86 + sl.jx, y: floorY - sl.row * unit() * 0.98 - (reach - R * Math.cos(Geometry.lying)) * (sl.row ? 0.5 : 0), s: R / 100 };
    };
    const active = () => plan.filter((sl) => sl.row < rowsFor(size.width) && sl.i < widthOf(sl));

    const ro = new ResizeObserver(() => {
      size = { width: card.clientWidth, height: card.clientHeight };
      if (started) active().forEach((sl, i) => { const c = heap[i]; if (!c) return; const r = restOf(sl); c.place(r.x, r.y, r.s); if (!c.drop) { c.p.x = r.x; c.p.y = r.y; c.p.s = r.s; } });
      loop.wake();
    });
    ro.observe(card);

    // The coins drop in from the bottom row up, sides alternating, so each one lands on coins already there.
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started) return;
      started = true;
      const order = active().map((sl, k) => ({ sl, k })).sort((a, b) => a.sl.row - b.sl.row || a.sl.i - b.sl.i || a.sl.side - b.sl.side);
      active().forEach((sl, k) => {
        const c = new Coin();
        c.face = FACES[k % FACES.length];
        c.setInk([255, 255, 255], true);
        c.idle = false;
        // Lower rows are nearer the viewer, so they draw over the coins resting on them.
        c.z = -sl.row * 10 + sl.i * 0.1;
        c.kp = [200, 27]; c.kr = [70, 15]; c.ks = [150, 23];
        heap[k] = c;
      });
      // A quick, slightly irregular shower, row by row so no coin lands before the ones it rests on.
      order.forEach(({ sl, k }, n) => {
        queue.push({ at: time + (reduce ? 0 : 0.05 * n + sl.row * 0.16 + rand(0, 0.05)), run: () => {
          const c = heap[k], r = restOf(sl);
          c.place(r.x, r.y, r.s);
          c.pose({ wx: sl.wx, wy: sl.wy, lz: sl.lz });
          if (reduce) { c.snap(r.x, r.y, r.s); c.snapAngles({ wx: sl.wx, wy: sl.wy, lz: sl.lz }); return; }
          c.snap(r.x + rand(-8, 8), -unit() * 2 - rand(0, 70), r.s);
          c.place(r.x, r.y, r.s);
          c.snapAngles({ wx: rand(-0.6, 0.6), wy: rand(-1.5, 1.5), lz: rand(-0.8, 0.8) });
          c.pose({ wx: sl.wx, wy: sl.wy, lz: sl.lz });
          c.dropOnto(3400, 0.1);
        } });
      });
      loop.wake();
    }, { threshold: 0.4 });
    io.observe(card);

    /** A landing knocks the coins it lands on and beside: a small dip and wobble, more for a harder, closer hit. */
    const thud = (c: Coin) => {
      const impact = Math.min(1, c.landed / 1700), R = unit();
      for (const o of heap) {
        if (!o || o === c || o.drop || o.p.s < 0.01) continue;
        const dx = Math.abs(o.p.x - c.p.x), dy = o.p.y - c.p.y;
        if (dx > R * 2.3 || dy < -R * 0.4) continue;
        const f = impact * (1 - dx / (R * 2.3));
        o.v.y += 120 * f;
        o.v.wx += rand(-0.9, 0.9) * f;
        o.v.lz += rand(-0.6, 0.6) * f;
      }
      if (impact > 0.75 && !reduce) stars.burst(c.p.x, c.p.y + R * 0.6, 2, 60, [2, 4], "#ddad44");
    };

    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button")) return;
      const r = card.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      const hit = [...heap].reverse().find((c) => Math.hypot(c.p.x - x, c.p.y - y) < 100 * c.p.s * 1.1);
      if (hit) {
        // A flip with a little hop; it lands back with a thud on its neighbours.
        if (!reduce) { hit.t.wy += TAU; hit.dropOnto(2600, 0.1, -380); }
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
      heap.forEach((c) => { c.update(dt, size); if (c.landed) thud(c); });
      tossed.forEach((c) => c.flight && c.update(dt, size));
      stars.update(dt);
      const { ctx } = fitCanvas(canvas);
      // Soft ground shadows under each mound, inside the card.
      if (started) for (const side of [-1, 1]) {
        const R = unit(), cx = moundCentre(side), cy = size.height - R * 0.32, rx = R * (narrow() ? 3.2 : 4.2);
        const n = heap.filter((c, i) => c && active()[i]?.side === side && !c.drop && c.p.s > 0.01).length;
        if (!n) continue;
        ctx.save();
        ctx.translate(cx, cy); ctx.scale(1, 0.07);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
        g.addColorStop(0, `rgb(0 15 6 / ${Math.min(0.4, 0.05 * n).toFixed(2)})`); g.addColorStop(1, "rgb(0 15 6 / 0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill();
        ctx.restore();
      }
      for (const c of [...heap].filter(Boolean).sort((a, b) => a.z - b.z)) if (c.p.s > 0.004) drawCoin(ctx, c, { time, reduceMotion: reduce });
      for (const c of tossed) if (c.flight) drawCoin(ctx, c, { time, reduceMotion: reduce });
      stars.draw(ctx, "#ddad44");
      return queue.length > 0 || !stars.isEmpty || tossed.some((c) => c.flight) || !heap.every((c) => !c || c.isSettled);
    });

    return () => { loop.stop(); ro.disconnect(); io.disconnect(); card.removeEventListener("click", onClick); };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
