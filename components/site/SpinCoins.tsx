"use client";

import { useEffect, useRef, useState } from "react";
import { Coin, Geometry, Stars, TAU, drawCoin, fitCanvas, prefersReducedMotion, runLoop } from "@/lib/coins/engine";
import { CoinMark } from "./CoinMark";

/** Room round the icon for the hop and the stars. */
const MARGIN = 12;

/**
 * The two-coin mark that, each time its button is hovered or focused, swaps its artwork for the hero's 3D coins and
 * plays the home logo's spin (the top coin first, with a hop, while the launch stars twinkle), then hands back to the
 * artwork, as the app's HomeLogo does.
 */
export function SpinCoins({ className = "" }: { className?: string }) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    const box = boxRef.current!, canvas = canvasRef.current!;
    const trigger = box.closest("a,button") ?? box;
    const reduce = prefersReducedMotion();
    const front = new Coin(), back = new Coin(), stars = new Stars();
    front.z = 1;
    for (const c of [front, back]) { c.idle = false; c.setInk([255, 255, 255], true); c.kp = [150, 16]; c.kr = [100, 17]; }
    let time = 0, finishAt = 0, pending: { at: number; run: () => void }[] = [];

    const play = () => {
      if (reduce) return;
      const h = box.clientHeight, w = box.clientWidth || h;
      const placed = Geometry.artCoins(MARGIN + w / 2, MARGIN + h / 2, h);
      for (const [c, p, rest] of [[front, placed.front, Geometry.frontRest], [back, placed.back, Geometry.backRest]] as const) {
        c.snap(p.x, p.y, placed.scale);
        c.snapAngles(rest);
      }
      const k = h / 40;
      front.t.wy += TAU; front.v.y -= 70 * k;
      pending = [
        { at: time + 0.09, run: () => { back.t.wy -= TAU; back.v.y -= 55 * k; } },
        { at: time + 0.2, run: () => stars.add(placed.stars.upper.x, placed.stars.upper.y, { r: 6 * k, max: 1.2, drag: 50 }) },
        { at: time + 0.38, run: () => stars.add(placed.stars.lower.x, placed.stars.lower.y, { r: 5 * k, max: 1.2, drag: 50 }) },
      ];
      finishAt = time + 1.15;
      setSpinning(true);
      loop.wake();
    };
    // The icon slides in as the button widens; the spin starts as it arrives.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onEnter = () => { clearTimeout(timer); timer = setTimeout(play, 90); };
    trigger.addEventListener("pointerenter", onEnter);
    trigger.addEventListener("focus", onEnter);

    const loop = runLoop(canvas, (dt, t) => {
      time = t;
      for (const p of pending.filter((p) => p.at <= time)) p.run();
      pending = pending.filter((p) => p.at > time);
      front.update(dt); back.update(dt); stars.update(dt);
      const { ctx } = fitCanvas(canvas);
      for (const c of [back, front]) drawCoin(ctx, c, { time, reduceMotion: true });
      stars.draw(ctx, "#ffffff");
      if (finishAt && time >= finishAt && front.isSettled && back.isSettled && stars.isEmpty) { finishAt = 0; setSpinning(false); return false; }
      return !!finishAt;
    });

    return () => { loop.stop(); clearTimeout(timer); trigger.removeEventListener("pointerenter", onEnter); trigger.removeEventListener("focus", onEnter); };
  }, []);

  return (
    <span ref={boxRef} className={`relative inline-block ${className}`} aria-hidden>
      <CoinMark className={`h-full w-full transition-opacity duration-200 ${spinning ? "opacity-0" : "opacity-100"}`} />
      <canvas
        ref={canvasRef}
        className={`pointer-events-none absolute transition-opacity duration-200 ${spinning ? "opacity-100" : "opacity-0"}`}
        style={{ inset: -MARGIN, width: `calc(100% + ${2 * MARGIN}px)`, height: `calc(100% + ${2 * MARGIN}px)` }}
      />
    </span>
  );
}
