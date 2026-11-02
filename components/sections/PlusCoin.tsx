"use client";

import { useEffect, useRef } from "react";
import { Coin, STAR, Stars, drawCoin, fitCanvas, hex, prefersReducedMotion, runLoop } from "@/lib/coins/engine";

/** Gentle turn, in radians a second. */
const CRUISE = 1.1;

/**
 * A large gold coin with the brand star on both faces, turning steadily about its own axis. Its tilt stays the same
 * all the way round. Tap it to flick it faster; it eases back to its cruise.
 */
export function PlusCoin() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const reduce = prefersReducedMotion();
    const coin = new Coin();
    const stars = new Stars();
    coin.face = STAR;
    coin.tiltOuter = true;
    coin.setInk(hex("#ddad44"), true);
    coin.snapAngles({ wx: 0.3, wy: 0.35, lz: 0 });
    let boost = 0, time = 0;
    const size = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      coin.snap(w / 2, h / 2, (Math.min(w, h) * 0.34) / 100);
    };
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    const flick = () => {
      if (reduce) return;
      boost = 16;
      coin.v.y -= 160;
      stars.sparkle(coin, 4, "#ffffff");
      loop.wake();
    };
    canvas.addEventListener("pointerdown", flick);
    const loop = runLoop(canvas, (dt, t) => {
      time = t;
      if (!reduce) {
        // Spin by hand rather than with the springs, so the turn never settles back to a set angle.
        boost *= Math.exp(-dt * 1.6);
        coin.p.wy += (CRUISE + boost) * dt;
        coin.t.wy = coin.p.wy;
        coin.v.wy = 0;
      }
      coin.update(dt);
      stars.update(dt);
      const { ctx } = fitCanvas(canvas);
      // A solid coin: its face and notches are painted in the card's green rather than cut out, so the receipt
      // beneath doesn't show through.
      drawCoin(ctx, coin, { time, reduceMotion: reduce, hole: "#004d22" });
      stars.draw(ctx, "#ffffff");
      return !reduce || !stars.isEmpty || !coin.isSettled;
    });
    return () => { loop.stop(); ro.disconnect(); canvas.removeEventListener("pointerdown", flick); };
  }, []);
  return <canvas ref={canvasRef} aria-hidden className="h-full w-full cursor-pointer" />;
}
