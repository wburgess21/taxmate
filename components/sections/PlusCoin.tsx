"use client";

import { useEffect, useRef } from "react";
import { Coin, Stars, TAU, drawCoin, fitCanvas, hex, prefersReducedMotion, runLoop } from "@/lib/coins/engine";

/** A large gold coin turning slowly on the Plus card. Tap it for a quick spin. */
export function PlusCoin() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const reduce = prefersReducedMotion();
    const coin = new Coin();
    const stars = new Stars();
    coin.face = "+";
    coin.setInk(hex("#ddad44"), true);
    coin.snapAngles({ wx: 0.32, wy: 0.4, lz: -0.1 });
    coin.kr = [40, 9];
    let next = 2.5, time = 0;
    const size = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      coin.snap(w / 2, h / 2, Math.min(w, h) * 0.34 / 100);
    };
    const ro = new ResizeObserver(size);
    ro.observe(canvas);
    const spin = () => {
      if (reduce) return;
      coin.t.wy += TAU; coin.v.y -= 140;
      stars.sparkle(coin, 4, "#ffffff");
      loop.wake();
    };
    canvas.addEventListener("pointerdown", spin);
    const loop = runLoop(canvas, (dt, t) => {
      time = t;
      // Every few seconds it turns over by itself, showing the brand star on its back.
      if (!reduce && t > next) { next = t + 4.5; coin.t.wy += Math.PI; if (Math.round(coin.t.wy / Math.PI) % 2 === 0) stars.sparkle(coin, 2, "#ffffff"); }
      coin.update(dt);
      stars.update(dt);
      const { ctx } = fitCanvas(canvas);
      drawCoin(ctx, coin, { time, reduceMotion: reduce });
      stars.draw(ctx, "#ffffff");
    });
    return () => { loop.stop(); ro.disconnect(); canvas.removeEventListener("pointerdown", spin); };
  }, []);
  return <canvas ref={canvasRef} aria-hidden className="h-full w-full cursor-pointer" />;
}
