"use client";

import { useEffect, useRef } from "react";
import { GROUPS } from "@/lib/tools";
import { Coin, Stars, TAU, cssColor, drawCoin, fitCanvas, onSchemeChange, prefersReducedMotion, runLoop } from "@/lib/coins/engine";

const REST = { wx: 0.28, wy: 0.42, lz: -0.05 };

/** Tool groups as editorial columns, each tool wearing a coin with its icon that spins when you hover the row. */
export function ToolCoins() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current!, canvas = canvasRef.current!;
    const reduce = prefersReducedMotion();
    const rows = Array.from(root.querySelectorAll<HTMLElement>("[data-tool]"));
    const stars = new Stars();
    stars.reduceMotion = reduce;
    const coins = rows.map((row) => {
      const c = new Coin();
      c.face = `@${row.dataset.icon}`;
      c.tiltOuter = true;
      c.snapAngles(REST);
      c.kr = [90, 11];
      return c;
    });
    const inks = () => rows.forEach((row, i) => coins[i].setInk(cssColor(row, row.dataset.tint!), true));
    inks();
    let shown = false, time = 0;
    const queue: { at: number; run: () => void }[] = [];

    const place = () => {
      const r0 = root.getBoundingClientRect();
      rows.forEach((row, i) => {
        const a = row.querySelector<HTMLElement>(".tool-row-coin")!.getBoundingClientRect();
        const s = (a.width * 0.44) / 100;
        coins[i].snap(a.left - r0.left + a.width / 2, a.top - r0.top + a.height / 2, shown || reduce ? s : 0);
        coins[i].t.s = shown || reduce ? s : 0;
        (coins[i] as Coin & { size: number }).size = s;
      });
    };
    const ro = new ResizeObserver(() => { place(); loop.wake(); });
    ro.observe(root);

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || shown) return;
      shown = true;
      coins.forEach((c, i) => queue.push({ at: time + (reduce ? 0 : 0.08 * i), run: () => {
        c.t.s = (c as Coin & { size: number }).size;
        if (!reduce) { c.p.wy = REST.wy - TAU; c.v.y -= 60; }
      } }));
      loop.wake();
    }, { threshold: 0.2 });
    io.observe(root);

    const enter = (i: number) => () => {
      const c = coins[i];
      if (!reduce) { c.t.wy += TAU; c.v.y -= 90; }
      stars.sparkle(c, 2, `rgb(${c.ink.join(" ")})`);
      loop.wake();
    };
    const handlers = rows.map((row, i) => { const h = enter(i); row.addEventListener("pointerenter", h); return h; });
    const offScheme = onSchemeChange(() => { inks(); loop.wake(); });

    const loop = runLoop(canvas, (dt, t) => {
      time = t;
      for (let i = queue.length - 1; i >= 0; i--) if (queue[i].at <= time) { queue[i].run(); queue.splice(i, 1); }
      coins.forEach((c) => { c.idle = false; c.update(dt); });
      stars.update(dt);
      const { ctx } = fitCanvas(canvas);
      for (const c of coins) drawCoin(ctx, c, { time, reduceMotion: reduce });
      stars.draw(ctx, "#ddad44");
      return queue.length > 0 || !stars.isEmpty || !coins.every((c) => c.isSettled);
    });

    return () => { loop.stop(); ro.disconnect(); io.disconnect(); offScheme(); rows.forEach((row, i) => row.removeEventListener("pointerenter", handlers[i])); };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <div className="grid gap-x-10 gap-y-14 lg:grid-cols-3">
        {GROUPS.map((g) => (
          <div key={g.id} style={{ ["--tint" as string]: g.tint }}>
            <div className="mb-5 flex items-baseline gap-3">
              <span className="h-2.5 w-2.5 translate-y-[-2px] rounded-full" style={{ background: g.tint }} />
              <h3 className="text-2xl font-light tracking-tight">{g.title}</h3>
            </div>
            <p className="mb-6 text-muted">{g.summary}</p>
            <ul>
              {g.tools.map((t) => (
                <li key={t.title} className="tool-row" data-tool data-icon={t.icon} data-tint={g.tint}>
                  <span className="tool-row-coin" aria-hidden />
                  <span>
                    <span className="block text-[1.0625rem] font-medium">{t.title}</span>
                    <span className="block text-[0.9375rem] leading-snug text-muted">{t.benefit}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute -inset-0 h-full w-full" />
    </div>
  );
}
