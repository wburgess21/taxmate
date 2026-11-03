"use client";

import { useEffect, useRef, useState } from "react";
import { Coin, cssColor, drawCoin, fitCanvas, onSchemeChange, prefersReducedMotion, runLoop, smooth } from "@/lib/coins/engine";
import { KEY_DATES, longDate, upcomingKeyDates } from "@/lib/keyDates";

type State = {
  start: Date;
  end: Date;
  today: Date;
  marks: { title: string; detail: string; at: Date; days: number; past: boolean; next: boolean }[];
};

/** The current tax year (6 April – 5 April) around `now`, with its key dates. */
function taxYear(now: Date): State {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const y = today >= new Date(today.getFullYear(), 3, 6) ? today.getFullYear() : today.getFullYear() - 1;
  const start = new Date(y, 3, 6), end = new Date(y + 1, 3, 5);
  const next = upcomingKeyDates(now, 1)[0];
  const marks = [y, y + 1]
    .flatMap((year) => KEY_DATES.map((d) => ({ ...d, at: new Date(year, d.month - 1, d.day) })))
    .filter((d) => d.at >= start && d.at <= end)
    .sort((a, b) => +a.at - +b.at)
    .map((d) => ({ title: d.title, detail: d.detail, at: d.at, days: Math.round((+d.at - +today) / 86_400_000), past: d.at < today, next: +d.at === +next.at }));
  return { start, end, today, marks };
}

const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const pct = (s: State, d: Date) => ((+d - +s.start) / (+s.end - +s.start)) * 100;

/** Key dates on the tax year, with a coin that rolls along to today. Worked out in the visitor's browser. */
export function YearTimeline() {
  const [s, setS] = useState<State | null>(null);
  const [count, setCount] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setS(taxYear(new Date())));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!s) return;
    const canvas = canvasRef.current!, track = trackRef.current!;
    const reduce = prefersReducedMotion();
    const coin = new Coin();
    coin.face = "@pound-sterling";
    coin.idle = false;
    coin.snapAngles({ wx: 0.1, wy: 0.16, lz: 0 });
    // A solid face in the page colour, so the track and its markers don't show through the coin.
    let hole = "";
    const ink = () => {
      coin.setInk(cssColor(canvas, "var(--coin-ink)"), true);
      hole = `rgb(${cssColor(canvas, "var(--canvas)").join(" ")})`;
    };
    ink();
    const next = s.marks.find((m) => m.next);
    let rolling = -1, time = 0;
    const target = pct(s, s.today) / 100;

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && rolling < 0) { rolling = 0; loop.wake(); }
    }, { threshold: 0.5 });
    io.observe(track);
    const offScheme = onSchemeChange(() => { ink(); loop.wake(); });

    const loop = runLoop(canvas, (dt, t) => {
      time = t;
      const { ctx, width, height } = fitCanvas(canvas);
      const R = Math.min(28, height * 0.42), y = height / 2;
      if (rolling < 0) return false;
      rolling = Math.min(1, rolling + dt / (reduce ? 0.001 : 2.1));
      const u = smooth(rolling);
      // The coin and the line share this clock, and the markers' positioning, so the coin leads the line exactly.
      const distance = width * target, x = Math.max(R, distance * u);
      if (lineRef.current) lineRef.current.style.width = `${(distance * u).toFixed(1)}px`;
      // Rolls (nearly) without slipping, adjusted to a whole number of turns so the £ comes to rest upright.
      const turns = Math.max(1, Math.round(distance / R / (2 * Math.PI)));
      coin.snap(x, y - Math.abs(Math.sin(u * Math.PI * 6)) * 3 * (1 - u), R / 100);
      coin.p.lz = coin.t.lz = u * turns * 2 * Math.PI;
      drawCoin(ctx, coin, { time, reduceMotion: reduce, hole });
      if (next) setCount(Math.round(next.days * u));
      return rolling < 1;
    });
    return () => { loop.stop(); io.disconnect(); offScheme(); };
  }, [s]);

  const next = s?.marks.find((m) => m.next) ?? null;
  return (
    <div>
      <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="kicker">Next up</p>
          <p className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">{next?.title ?? "Self Assessment deadline"}</p>
          <p className="mt-2 text-muted">{next ? `${longDate(next.at)} · ${next.detail}` : " "}</p>
        </div>
        <p className="flex items-baseline gap-3 lg:justify-end">
          <span className="font-serif text-[6.5rem] italic leading-[0.8] tracking-[-0.03em] tabular-nums sm:text-[9rem]">{s ? count : "–"}</span>
          <span className="text-xl text-muted">days to go</span>
        </p>
      </div>

      <div ref={trackRef} className="relative mt-14 pb-2">
        {/* Month ticks */}
        <div className="grid grid-cols-12 text-[0.75rem] text-muted">
          {MONTHS.map((m, i) => <span key={m} className={i % 2 ? "max-sm:invisible" : ""}>{m}</span>)}
        </div>
        <div className="relative mt-3 h-16">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-hairline" />
          {s && <div ref={lineRef} className="absolute left-0 top-1/2 h-[3px] w-0 -translate-y-1/2 rounded-full bg-[var(--tool-income)]" />}
          {s?.marks.map((m) => (
            <span
              key={+m.at}
              className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pct(s, m.at)}%` }}
              title={`${m.title}, ${longDate(m.at)}`}
            >
              <span className={`block rounded-full ${m.next ? "h-4 w-4 bg-gold ring-[6px] ring-[color-mix(in_srgb,var(--gold)_25%,transparent)]" : m.past ? "h-2.5 w-2.5 bg-[var(--faint)]" : "h-3 w-3 border-2 border-ink bg-canvas"}`} />
            </span>
          ))}
          <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
        </div>
        <ol className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-5">
          {s?.marks.map((m) => (
            <li key={+m.at} className={m.past ? "opacity-45" : ""}>
              <p className="text-[0.8125rem] tabular-nums text-muted">{m.at.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}{m.next && <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 text-[0.75rem] font-medium text-[var(--tool-claims)]">Next</span>}</p>
              <p className="mt-1 font-medium leading-snug">{m.title}</p>
              <p className="mt-1 text-[0.875rem] leading-snug text-muted">{m.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
