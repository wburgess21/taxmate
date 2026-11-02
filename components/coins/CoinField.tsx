"use client";

import { useEffect, useRef } from "react";
import { Coin, Stars, drawCoin, fitCanvas, heroCardColour, prefersReducedMotion, rand, runLoop } from "@/lib/coins/engine";

/** Where the resting coins sit, as fractions of the card, clear of the centred copy. */
const SPOTS: { x: number; y: number; r: number; face: string; wx: number; wy: number; lz: number }[] = [
  { x: 0.08, y: 0.24, r: 0.9, face: "£", wx: 0.45, wy: 0.55, lz: -0.2 },
  { x: 0.17, y: 0.74, r: 0.7, face: "%", wx: 0.3, wy: -0.7, lz: 0.15 },
  { x: 0.9, y: 0.22, r: 0.75, face: "VAT", wx: 0.35, wy: -0.5, lz: 0.1 },
  { x: 0.84, y: 0.76, r: 1, face: "£", wx: 0.5, wy: 0.6, lz: 0 },
  { x: 0.3, y: 0.14, r: 0.45, face: "NI", wx: 0.2, wy: 0.9, lz: 0.3 },
  { x: 0.7, y: 0.9, r: 0.5, face: "%", wx: 0.6, wy: 0.3, lz: -0.3 },
];

/**
 * A handful of coins resting around the closing call to action. Hovering flips one; tapping one flips it with a
 * burst; tapping anywhere else on the card tosses a fresh coin into the air.
 */
export function CoinField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const card = canvas.parentElement!;
    const reduce = prefersReducedMotion();
    const sparks = new Stars();
    sparks.reduceMotion = reduce;
    let size = { width: 0, height: 0 };
    let entered = false;
    let time = 0;
    const resting = SPOTS.map((spot, i) => {
      const c = new Coin();
      c.face = spot.face;
      c.z = i;
      c.snapAngles(spot);
      return c;
    });
    const tossed: Coin[] = [];
    const hovered = new Set<Coin>();

    const unit = () => Math.min(size.width, size.height * 1.4) / 900;
    const placeAll = (snap = false) => {
      const u = unit(), narrow = size.width < 640;
      resting.forEach((c, i) => {
        const spot = SPOTS[i];
        // On phones the side coins tuck into the corners and the smallest two step aside.
        const hide = narrow && i >= 4;
        const s = hide ? 0 : (spot.r * 0.62 * u * (narrow ? 1.25 : 1));
        const x = spot.x * size.width, y = spot.y * size.height;
        if (snap) c.snap(x, y, entered || reduce ? s : 0);
        c.place(x, y, entered || reduce ? s : 0);
      });
    };

    const ro = new ResizeObserver(() => {
      const r = card.getBoundingClientRect();
      const first = size.width === 0;
      size = { width: r.width, height: r.height };
      placeAll(first);
      loop.wake();
    });
    ro.observe(card);

    // The coins pop in, one after another, the first time the card scrolls into view.
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || entered) return;
      entered = true;
      resting.forEach((c, i) => setTimeout(() => {
        const spot = SPOTS[i], u = unit(), narrow = size.width < 640;
        if (narrow && i >= 4) return;
        c.t.s = spot.r * 0.62 * u * (narrow ? 1.25 : 1);
        if (!reduce) { c.t.wy += Math.PI * 2; sparks.sparkle(c, 2); }
        loop.wake();
      }, reduce ? 0 : 90 * i));
    }, { threshold: 0.35 });
    io.observe(card);

    const flip = (c: Coin, burst: boolean) => {
      if (reduce) { sparks.sparkle(c, 2); return; }
      c.t.wy += Math.PI * 2 * (Math.random() < 0.5 ? 1 : -1);
      c.v.y -= 180;
      if (burst) sparks.burst(c.p.x, c.p.y, 7, 220, [3, 7]);
      else sparks.sparkle(c, 2);
    };

    const local = (e: MouseEvent | PointerEvent) => {
      const r = card.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const coinAt = (x: number, y: number) =>
      [...resting].reverse().find((c) => c.p.s > 0.05 && Math.hypot(c.p.x - x, c.p.y - y) < 100 * c.p.s * 1.1);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const { x, y } = local(e);
      const c = coinAt(x, y);
      for (const h of hovered) if (h !== c) hovered.delete(h);
      if (c && !hovered.has(c)) { hovered.add(c); flip(c, false); loop.wake(); }
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button")) return;
      const { x, y } = local(e);
      const c = coinAt(x, y);
      if (c) flip(c, true);
      else if (!reduce) {
        // Toss a coin from where the card was tapped.
        const coin = tossed.find((t) => !t.flight) ?? (tossed.length < 12 ? (tossed.push(new Coin()), tossed[tossed.length - 1]) : null);
        if (!coin) return;
        const faces = ["£", "%", "£", "VAT", "NI"];
        coin.face = faces[Math.floor(Math.random() * faces.length)];
        coin.z = 50;
        const s = 0.5 * unit();
        coin.snap(x, y, s);
        coin.snapAngles({ wx: rand(0.2, 0.6), wy: rand(-1, 1), lz: rand(-0.3, 0.3) });
        coin.flight = { vx: rand(-160, 160), vy: -rand(620, 820), gravity: 1500, ax: rand(-3, 3), ay: rand(10, 16) * (Math.random() < 0.5 ? 1 : -1), az: rand(-2, 2) };
        sparks.burst(x, y, 5, 160, [3, 6]);
      }
      loop.wake();
    };
    card.addEventListener("pointermove", onMove);
    card.addEventListener("click", onClick);

    const loop = runLoop(canvas, (dt, t) => {
      time = t;
      for (const c of resting) c.update(dt, size);
      for (const c of tossed) if (c.flight) c.update(dt, size);
      sparks.update(dt);
      const { ctx, width, height } = fitCanvas(canvas);
      ctx.clearRect(0, 0, width, height);
      for (const c of [...resting, ...tossed.filter((c) => c.flight)]) {
        drawCoin(ctx, c, time, "#fff", heroCardColour(c.p.x, c.p.y, size.width, size.height), reduce);
      }
      sparks.draw(ctx, "#ddad44");
    });

    return () => {
      loop.stop();
      ro.disconnect();
      io.disconnect();
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("click", onClick);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 -z-10 h-full w-full rounded-[inherit]" />;
}
