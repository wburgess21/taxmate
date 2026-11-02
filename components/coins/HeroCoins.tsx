"use client";

import { useEffect, useRef } from "react";
import { Coin, Geometry, Stars, drawCoin, fitCanvas, heroCardColour, prefersReducedMotion, runLoop, starPath } from "@/lib/coins/engine";
import { bezier, keyframes } from "@/lib/coins/easing";

/**
 * The app's launch animation on the hero card: two coins slide together from above and below, land with a little
 * overshoot and two stars pop in. Then the pair behaves like the app's home logo: tap to spin them, top coin first,
 * with a hop and a twinkle. The pair leans gently towards the pointer.
 *
 * Draws over the whole card (the parent), placing the coins in the `[data-coin-slot]` element inside it, so holes in
 * the coins can be painted in the card's own gradient.
 */
export function HeroCoins() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const card = canvas.parentElement!;
    const slot = card.querySelector<HTMLElement>("[data-coin-slot]")!;
    const reduce = prefersReducedMotion();
    const front = new Coin(), back = new Coin();
    const sparks = new Stars();
    sparks.reduceMotion = reduce;
    front.z = 1;

    // Launch keyframes, in seconds (the app's timeline at its 0.765 pace).
    const pace = 0.765, contact = 0.96 * pace;
    const approachCurve = bezier(0.5, 0.2, 0.9, 0.55);
    const settle = bezier(0.4, 0, 0.5, 1);
    const popCurve = bezier(0.2, 0.9, 0.3, 1.25);
    const approach = keyframes(1, [[0, contact, approachCurve]]);
    const drop = keyframes(0, [[45, contact, approachCurve], [-14, 0.288 * pace, settle], [0, 0.352 * pace, settle]]);
    const pop = (delay: number) => keyframes(0, [[0, delay * pace], [1, 0.8 * pace, popCurve]]);
    const fade = (delay: number) => keyframes(0, [[0, delay * pace], [1, 0.48 * pace, popCurve]]);
    const upperPop = pop(1.4), lowerPop = pop(1.65), upperFade = fade(1.4), lowerFade = fade(1.65);
    const launchEnd = (1.65 + 0.8) * pace;

    let launchTime = reduce ? launchEnd : 0;
    let handedOver = false;
    // The art stars' own twinkle, replayed on each tap: time since it started.
    let twinkle = 99;
    let pointer = { x: 0, y: 0, active: false };
    let lastDraw = 0, interacted = false, attractAt = launchEnd + 3.2;
    const pending: { at: number; run: () => void }[] = [];
    let clock = 0;

    let layout = { cx: 0, cy: 0, height: 0, w: 0, h: 0 };
    const measure = () => {
      const c = card.getBoundingClientRect(), s = slot.getBoundingClientRect();
      layout = { cx: s.left - c.left + s.width / 2, cy: s.top - c.top + s.height / 2, height: Math.min(s.height, s.width * 1.02) * 0.86, w: c.width, h: c.height };
    };
    measure();
    const ro = new ResizeObserver(() => { measure(); if (handedOver) placeAtRest(false); loop.wake(); });
    ro.observe(card);

    const rest = () => Geometry.artCoins(layout.cx, layout.cy, layout.height);

    function placeAtRest(snap: boolean) {
      const r = rest();
      const nx = pointer.active ? pointer.x : 0, ny = pointer.active ? pointer.y : 0;
      const shift = layout.height * 0.03;
      for (const [coin, at, o] of [[front, r.front, Geometry.frontRest], [back, r.back, Geometry.backRest]] as const) {
        const x = at.x + nx * shift * (coin === front ? 1 : 0.6), y = at.y + ny * shift * (coin === front ? 1 : 0.6);
        if (snap) { coin.snap(x, y, r.scale); coin.snapAngles(o); }
        else coin.place(x, y, r.scale);
        coin.t.s = r.scale;
        coin.pose({ wx: o.wx + ny * 0.22, wy: o.wy + nx * 0.3, lz: o.lz });
      }
    }

    function spin(byUser: boolean) {
      if (!handedOver) return;
      if (byUser) interacted = true;
      twinkle = 0;
      if (reduce) return;
      const hop = Math.min(layout.height / 40, 9);
      front.kp = [150, 16]; front.kr = [100, 17];
      back.kp = [150, 16]; back.kr = [100, 17];
      front.t.wy += Math.PI * 2; front.v.y -= 70 * hop;
      pending.push({ at: clock + 0.09, run: () => { back.t.wy -= Math.PI * 2; back.v.y -= 55 * hop; } });
      pending.push({ at: clock + 0.2, run: () => sparks.sparkle(front, 4) });
      pending.push({ at: clock + 0.38, run: () => sparks.sparkle(back, 3) });
    }

    // The pair is tapped where its coins are; elsewhere on the card is left to the card's own content.
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a,button")) return;
      const c = card.getBoundingClientRect(), x = e.clientX - c.left, y = e.clientY - c.top;
      const hit = [front, back].some((coin) => Math.hypot(coin.p.x - x, coin.p.y - y) < 100 * coin.p.s * 1.15);
      if (hit) { spin(true); loop.wake(); }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const c = card.getBoundingClientRect();
      pointer = {
        x: Math.max(-1, Math.min(1, (e.clientX - (c.left + layout.cx)) / (c.width / 2))),
        y: Math.max(-1, Math.min(1, (e.clientY - (c.top + layout.cy)) / (c.height / 2))),
        active: !reduce,
      };
      const hover = [front, back].some((coin) => Math.hypot(coin.p.x - (e.clientX - c.left), coin.p.y - (e.clientY - c.top)) < 100 * coin.p.s * 1.15);
      card.style.cursor = hover && handedOver ? "pointer" : "";
      if (handedOver) { placeAtRest(false); loop.wake(); }
    };
    const onLeave = () => { pointer.active = false; card.style.cursor = ""; if (handedOver) { placeAtRest(false); loop.wake(); } };
    card.addEventListener("click", onClick);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);

    const cardColour = (x: number, y: number) => heroCardColour(x, y, layout.w, layout.h);

    function drawArtStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, popValue: number, opacity: number) {
      if (opacity <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.min(opacity, 1);
      ctx.translate(x, y);
      ctx.rotate((-120 * (1 - popValue) * Math.PI) / 180);
      ctx.scale(popValue, popValue);
      starPath(ctx, r);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.restore();
    }

    const loop = runLoop(canvas, (dt, time) => {
      clock = time;
      for (const p of pending.filter((p) => p.at <= clock)) p.run();
      for (let i = pending.length - 1; i >= 0; i--) if (pending[i].at <= clock) pending.splice(i, 1);

      const launching = launchTime < launchEnd;
      if (launching) launchTime += dt;
      if (!launching && !handedOver) { handedOver = true; placeAtRest(true); }
      if (handedOver && !interacted && !reduce && launchTime >= attractAt) { attractAt = Infinity; spin(false); }
      if (handedOver) { const bounds = { width: layout.w, height: layout.h };
        front.update(dt, bounds); back.update(dt, bounds); }
      sparks.update(dt);
      twinkle += dt;

      // At rest, the idle bob only needs a gentle frame rate.
      const settled = handedOver && front.isSettled && back.isSettled && sparks.isEmpty && twinkle > 1 && pending.length === 0;
      if (settled && time - lastDraw < 1 / 24) return;
      lastDraw = time;

      const { ctx, width, height } = fitCanvas(canvas);
      ctx.clearRect(0, 0, width, height);
      const r = rest(), k = layout.height / 1457, starsAt = Geometry.artStars(layout.cx, layout.cy, layout.height);

      if (!handedOver) {
        // Launch: the front coin falls from above the card, the back coin rises from below, and they meet.
        const travel = Math.max(layout.cy + layout.height, layout.h - layout.cy + layout.height);
        const offset = drop(launchTime) * k - approach(launchTime) * travel;
        back.snap(r.back.x, r.back.y - offset, r.scale); back.snapAngles(Geometry.backRest);
        front.snap(r.front.x, r.front.y + offset, r.scale); front.snapAngles(Geometry.frontRest);
        back.idle = front.idle = false;
      } else {
        back.idle = front.idle = true;
      }
      for (const coin of [back, front]) drawCoin(ctx, coin, time, "#fff", cardColour(coin.p.x, coin.p.y), reduce);

      // The launch art's two stars: popped in during the launch, re-twinkling on each spin.
      const tw = twinkle < 0.9 ? Math.sin((twinkle / 0.9) * Math.PI) : 0;
      const breathe = reduce ? 0 : Math.sin(time * 1.6) * 0.06;
      const upper = handedOver ? 1 + breathe + tw * 0.45 : upperPop(launchTime);
      const lower = handedOver ? 1 - breathe + tw * 0.35 : lowerPop(launchTime);
      drawArtStar(ctx, starsAt.upper.x, starsAt.upper.y, 135 * k, upper, handedOver ? 1 : upperFade(launchTime));
      drawArtStar(ctx, starsAt.lower.x, starsAt.lower.y, 105 * k, lower, handedOver ? 1 : lowerFade(launchTime));
      sparks.draw(ctx, "#ddad44");
    });

    return () => {
      loop.stop();
      ro.disconnect();
      card.removeEventListener("click", onClick);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 -z-10 h-full w-full rounded-[inherit]" />;
}
