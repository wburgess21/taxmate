"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Coin, Geometry, Stars, cssColor, drawCoin, fitCanvas, onSchemeChange, prefersReducedMotion, rand, runLoop, type RGB } from "@/lib/coins/engine";
import { gbp, takeHome, type Region } from "@/lib/takeHome";

const PER_COIN = 1000;
const PER_COLUMN = 20;
const CATS = [
  { id: "keep", label: "You keep", short: "You keep", tint: "var(--coin-ink)", dot: "var(--tool-income)", columns: 5 },
  { id: "tax", label: "Income Tax", short: "Tax", tint: "var(--tool-claims)", dot: "var(--tool-claims)", columns: 3 },
  { id: "ni", label: "National Insurance", short: "NI", tint: "var(--tool-planning)", dot: "var(--tool-planning)", columns: 1 },
] as const;
type Cat = (typeof CATS)[number]["id"];

/** Whole coins per category, by largest remainder so they add up to the rounded total. */
function allocate(parts: Record<Cat, number>) {
  const total = Math.round((parts.keep + parts.tax + parts.ni) / PER_COIN);
  const raw = CATS.map((c) => parts[c.id] / PER_COIN);
  const out = raw.map(Math.floor);
  let left = total - out.reduce((a, b) => a + b, 0);
  const order = raw.map((v, i) => [v - Math.floor(v), i]).sort((a, b) => b[0] - a[0]);
  for (let j = 0; left > 0 && j < order.length; j++, left--) out[order[j][1]]++;
  return { keep: out[0], tax: out[1], ni: out[2] } as Record<Cat, number>;
}

type PileCoin = Coin & { cat: Cat; leaving?: boolean };

export function PayPiles() {
  const [salary, setSalary] = useState(35_000);
  const [region, setRegion] = useState<Region>("rUK");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const api = useRef<{ set: (counts: Record<Cat, number>) => void } | null>(null);
  const id = useId();
  const parts = takeHome(salary, region);
  const counts = allocate(parts);
  const min = 12_000, max = 150_000;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const reduce = prefersReducedMotion();
    const piles: Record<Cat, PileCoin[]> = { keep: [], tax: [], ni: [] };
    const leaving: PileCoin[] = [];
    const stars = new Stars();
    stars.reduceMotion = reduce;
    let inks: Record<Cat, RGB> = { keep: [0, 0, 0], tax: [0, 0, 0], ni: [0, 0, 0] };
    const resolveInks = () => {
      inks = { keep: cssColor(canvas, "var(--coin-ink)"), tax: cssColor(canvas, "var(--tool-claims)"), ni: cssColor(canvas, "var(--tool-planning)") };
      for (const cat of CATS) for (const c of piles[cat.id]) c.setInk(inks[cat.id]);
    };
    resolveInks();
    let size = { width: 0, height: 0 };
    let visible = false, pending: Record<Cat, number> | null = null, queue: { at: number; run: () => void }[] = [];
    let time = 0;

    const geometry = () => {
      const W = size.width, H = size.height;
      const cols = CATS.reduce((a, c) => a + c.columns, 0), gaps = CATS.length - 1;
      const unit = W / (cols + gaps * 0.9 + 0.4);
      const R = Math.min(unit * 0.43, (H - 40) / (Geometry.stackRise(1) / 100 * (PER_COLUMN - 1) + 2.2) );
      const rise = Geometry.stackRise(R / 100);
      const base = H - R * 0.95;
      const starts: Record<Cat, number> = { keep: 0, tax: 0, ni: 0 };
      let x = unit * 0.2;
      for (const c of CATS) { starts[c.id] = x; x += c.columns * unit + unit * 0.9; }
      return { R, rise, base, unit, starts };
    };
    const slot = (cat: Cat, i: number) => {
      const g = geometry();
      const col = Math.floor(i / PER_COLUMN), row = i % PER_COLUMN;
      return { x: g.starts[cat] + (col + 0.5) * g.unit, y: g.base - row * g.rise, s: g.R / 100, z: row + col * 0.01 };
    };
    const settle = (c: PileCoin, cat: Cat, i: number) => {
      const p = slot(cat, i);
      c.place(p.x + rand(-1.2, 1.2), p.y, p.s);
      c.z = p.z;
      c.pose({ wx: Geometry.lying, wy: rand(-0.08, 0.08), lz: rand(-0.12, 0.12) });
    };

    function set(target: Record<Cat, number>) {
      if (!visible) { pending = target; return; }
      const pool: PileCoin[] = [];
      for (const cat of CATS) {
        const pile = piles[cat.id];
        while (pile.length > target[cat.id]) pool.push(pile.pop()!);
      }
      let delay = 0;
      for (const cat of CATS) {
        const pile = piles[cat.id];
        while (pile.length < target[cat.id]) {
          const i = pile.length;
          const reused = pool.shift();
          const c: PileCoin = reused ?? Object.assign(new Coin(), { cat: cat.id });
          c.cat = cat.id; c.idle = false;
          pile.push(c);
          const d = reduce ? 0 : delay;
          delay += reused ? 0.03 : 0.018;
          queue.push({ at: time + d, run: () => {
            if (!reused) {
              const p = slot(cat.id, i);
              c.snap(p.x + rand(-6, 6), p.y - size.height * 0.55 - rand(0, 60), p.s);
              c.snapAngles({ wx: Geometry.lying - rand(0.3, 0.8), wy: rand(-1, 1), lz: rand(-0.6, 0.6) });
              c.setInk(inks[cat.id], true);
              c.kp = [190, 15]; c.kr = [120, 14]; c.ks = [150, 19];
              if (reduce) c.snap(p.x, p.y, p.s);
            } else {
              c.kp = [110, 16]; c.v.y -= 380; c.setInk(inks[cat.id]); c.inkRate = 4;
            }
            settle(c, cat.id, i);
            if (reduce) { c.p = { ...c.t }; }
          } });
        }
      }
      // Coins nobody needs any more fly up and away.
      for (const c of pool) {
        c.leaving = true; c.kp = [80, 14]; c.ks = [60, 12];
        c.place(c.p.x + rand(-20, 20), c.p.y - 120, 0);
        leaving.push(c);
      }
      loop.wake();
    }
    api.current = { set };

    const ro = new ResizeObserver(() => {
      size = { width: canvas.clientWidth, height: canvas.clientHeight };
      for (const cat of CATS) piles[cat.id].forEach((c, i) => { settle(c, cat.id, i); c.p.x = c.t.x; c.p.y = c.t.y; c.p.s = c.t.s; });
      loop.wake();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visible) { visible = true; if (pending) { set(pending); pending = null; } }
    }, { threshold: 0.35 });
    io.observe(canvas);
    const offScheme = onSchemeChange(() => { resolveInks(); loop.wake(); });

    // Tapping a pile makes its coins hop, more the closer they are.
    const onTap = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (reduce) return;
      let hit = false;
      for (const cat of CATS) for (const c of piles[cat.id]) {
        const d = Math.hypot(c.p.x - x, (c.p.y - y) * 0.5);
        if (d < 140) { c.v.y -= (1 - d / 140) * 520 * rand(0.7, 1.1); c.v.wy += rand(-3, 3) * (1 - d / 140); hit = true; }
      }
      if (hit) stars.burst(x, y, 5, 180, [3, 6], "#ddad44");
      loop.wake();
    };
    canvas.addEventListener("pointerdown", onTap);

    const loop = runLoop(canvas, (dt, t) => {
      time = t;
      const due = queue.filter((q) => q.at <= time);
      queue = queue.filter((q) => q.at > time);
      due.forEach((q) => q.run());
      const all = [...piles.keep, ...piles.tax, ...piles.ni];
      for (const c of all) c.update(dt);
      for (let i = leaving.length - 1; i >= 0; i--) { leaving[i].update(dt); if (leaving[i].p.s < 0.004) leaving.splice(i, 1); }
      stars.update(dt);
      const { ctx, width, height } = fitCanvas(canvas);
      // A soft shadow under each pile grounds it.
      const g = geometry();
      for (const cat of CATS) for (let col = 0; col < cat.columns; col++) {
        const n = Math.min(PER_COLUMN, Math.max(0, piles[cat.id].length - col * PER_COLUMN));
        if (!n) continue;
        const x = g.starts[cat.id] + (col + 0.5) * g.unit, y = g.base + g.R * 0.5;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, g.R * 1.4);
        grd.addColorStop(0, "rgb(0 0 0 / 0.1)"); grd.addColorStop(1, "rgb(0 0 0 / 0)");
        ctx.fillStyle = grd; ctx.fillRect(x - g.R * 1.5, y - g.R, g.R * 3, g.R * 2);
      }
      for (const c of [...all, ...leaving].sort((a, b) => a.z - b.z)) drawCoin(ctx, c, { time, reduceMotion: reduce });
      stars.draw(ctx, "#ddad44");
      void width; void height;
      return !(queue.length === 0 && leaving.length === 0 && stars.isEmpty && all.every((c) => c.isSettled));
    });

    return () => { loop.stop(); ro.disconnect(); io.disconnect(); offScheme(); canvas.removeEventListener("pointerdown", onTap); };
  }, []);

  useEffect(() => { api.current?.set(counts); }, [counts.keep, counts.tax, counts.ni]); // eslint-disable-line react-hooks/exhaustive-deps

  const fill = ((salary - min) / (max - min)) * 100;
  const monthly = parts.keep / 12;

  return (
    <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
      <div>
        <p className="text-[4.5rem] font-light leading-none tracking-[-0.045em] tabular-nums sm:text-[6rem]" aria-live="polite">{gbp(monthly)}</p>
        <p className="mt-2 text-lg text-muted">take home a month, from {gbp(salary)} a year</p>

        <div className="mt-10">
          <div className="flex items-baseline justify-between">
            <label htmlFor={id} className="text-[0.9375rem] font-medium">Salary</label>
            <span className="text-[0.9375rem] tabular-nums text-muted">{gbp(salary)} a year</span>
          </div>
          <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={500}
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="coin-range mt-4 w-full"
            style={{ ["--fill" as string]: `${fill}%` }}
            aria-valuetext={`${gbp(salary)} a year`}
          />
        </div>

        <div role="radiogroup" aria-label="Where you pay tax" className="mt-8 inline-grid grid-cols-2 rounded-full border border-hairline bg-surface p-1">
          {([["rUK", "England, Wales & NI"], ["scotland", "Scotland"]] as const).map(([v, l]) => (
            <button key={v} role="radio" aria-checked={region === v} onClick={() => setRegion(v)}
              className={`rounded-full px-4 py-2 text-[0.9375rem] transition-colors ${region === v ? "bg-ink text-canvas" : "text-muted hover:text-ink"}`}>
              {l}
            </button>
          ))}
        </div>

        <dl className="mt-10 grid gap-3 border-t border-hairline pt-6">
          {CATS.map((c) => (
            <div key={c.id} className="flex items-center justify-between text-[1.0625rem]">
              <dt className="flex items-center gap-2.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: c.dot }} />{c.label}</dt>
              <dd className="tabular-nums text-muted">{gbp(parts[c.id] / 12)} <span className="text-[0.8125rem]">/ month</span></dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <div className="relative h-[340px] sm:h-[420px]">
          <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full cursor-pointer touch-manipulation" />
        </div>
        <div className="mt-4 grid border-t border-hairline pt-4 text-[0.8125rem] text-muted" style={{ gridTemplateColumns: "5.65fr 3.9fr 1.65fr" }}>
          {CATS.map((c) => <span key={c.id} className="truncate pr-2"><b className="font-medium text-ink">{counts[c.id]}</b> {c.short}</span>)}
        </div>
        <p className="mt-3 text-[0.8125rem] text-muted">Each coin is £1,000 a year. Tap a pile.</p>
      </div>
    </div>
  );
}
