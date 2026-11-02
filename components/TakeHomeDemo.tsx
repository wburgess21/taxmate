"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { TAX_YEAR } from "@/lib/site";

type Region = "rUK" | "scotland";
type Period = "month" | "year";

/** 2026/27 bands as in the app's TaxRules.swift: (upper limit of taxable income, rate). */
const BANDS: Record<Region, [number, number][]> = {
  rUK: [[37_700, 0.2], [125_140, 0.4], [Infinity, 0.45]],
  scotland: [[3_967, 0.19], [16_956, 0.2], [31_092, 0.21], [62_430, 0.42], [125_140, 0.45], [Infinity, 0.48]],
};

/** A rough annual take-home estimate: salary only, no pension, loans or benefits in kind. */
export function estimate(salary: number, region: Region) {
  const allowance = Math.max(0, 12_570 - Math.max(0, salary - 100_000) / 2);
  const taxable = Math.max(0, salary - allowance);
  let tax = 0, lower = 0;
  for (const [upper, rate] of BANDS[region]) {
    tax += Math.max(0, Math.min(taxable, upper) - lower) * rate;
    lower = upper;
  }
  const ni = Math.max(0, Math.min(salary, 50_270) - 12_570) * 0.08 + Math.max(0, salary - 50_270) * 0.02;
  return { tax, ni, takeHome: salary - tax - ni };
}

const gbp = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

/** Eases a displayed figure towards its target, like the app's numeric text transitions. */
function useTweened(value: number) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 420;
    const start = performance.now(), a = from.current;
    let raf = 0;
    const step = (now: number) => {
      const t = duration ? Math.min(1, (now - start) / duration) : 1, e = 1 - Math.pow(1 - t, 3);
      const v = a + (value - a) * e;
      from.current = v;
      setShown(v);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return shown;
}

function Segmented<T extends string>({ value, options, onChange, label }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid auto-cols-fr grid-flow-col rounded-[12px] bg-canvas p-1">
      {options.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-[9px] px-3 py-2 text-[0.9375rem] transition-all ${value === o.value ? "bg-surface font-medium shadow-[0_1px_4px_rgb(0_0_0/0.1)]" : "text-muted hover:text-ink"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function TakeHomeDemo() {
  const [salary, setSalary] = useState(35_000);
  const [region, setRegion] = useState<Region>("rUK");
  const [period, setPeriod] = useState<Period>("month");
  const id = useId();
  const { tax, ni, takeHome } = estimate(salary, region);
  const div = period === "month" ? 12 : 1;
  const shown = useTweened(takeHome / div);
  const keep = salary > 0 ? takeHome / salary : 1;
  const keepPct = Math.round(keep * 100);
  const min = 12_000, max = 150_000;
  const fill = ((salary - min) / (max - min)) * 100;

  return (
    <div className="grid gap-4">
      {/* LiveHeroCard */}
      <div className="hero-card overflow-hidden p-6 sm:p-7">
        <div className="eyebrow"><Sparkles className="h-4 w-4" aria-hidden /> Live estimate</div>
        <p className="mt-3 text-[2.75rem] font-light leading-none tracking-tight tabular-nums sm:text-5xl" aria-live="polite">
          {gbp(shown)}
        </p>
        <p className="mt-2 text-xl font-light">take home a {period}</p>
        <p className="mt-1 text-[0.9375rem] text-white/75">
          From a {gbp(salary)} salary · {region === "rUK" ? "England, Wales & NI" : "Scotland"} · {TAX_YEAR}
        </p>
        {/* KeepShareBar */}
        <div className="mt-5" role="img" aria-label={`You keep ${keepPct}% of your gross pay`}>
          <div className="flex h-2 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-white transition-[width] duration-500 ease-out" style={{ width: `${keep * 100}%` }} />
            <div className="ml-0.5 h-full flex-1 rounded-full bg-gold" />
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[0.8125rem] text-white/80">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-white" />You keep {keepPct}%</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gold" />Tax &amp; NI {100 - keepPct}%</span>
          </div>
        </div>
      </div>

      {/* Inputs card */}
      <div className="surface-card p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor={id} className="font-medium">Your salary</label>
          <span className="text-xl font-light tabular-nums">{gbp(salary)}<span className="text-sm text-muted"> / year</span></span>
        </div>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={500}
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
          className="salary-range mt-4 w-full"
          style={{ ["--fill" as string]: `${fill}%` }}
          aria-valuetext={`${gbp(salary)} a year`}
        />
        <div className="mt-5 grid gap-2.5">
          <Segmented label="Show per" value={period} onChange={setPeriod} options={[{ value: "month", label: "Monthly" }, { value: "year", label: "Annual" }]} />
          <Segmented label="Region" value={region} onChange={setRegion} options={[{ value: "rUK", label: "England, Wales & NI" }, { value: "scotland", label: "Scotland" }]} />
        </div>
        <dl className="mt-5 grid gap-2.5 border-t border-hairline pt-4 text-[0.9375rem]">
          {[
            ["Take home", takeHome, "var(--tool-income)"],
            ["Income Tax", tax, "var(--tool-claims)"],
            ["National Insurance", ni, "var(--tool-planning)"],
          ].map(([label, value, colour]) => (
            <div key={label as string} className="flex items-center justify-between">
              <dt className="flex items-center gap-2 text-muted"><span className="h-2 w-2 rounded-full" style={{ background: colour as string }} />{label}</dt>
              <dd className="tabular-nums">{gbp((value as number) / div)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
