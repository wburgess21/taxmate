"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/** Parses what people type for money: "£45,000", "45k", "1.5m", " 300 ". */
export function parseAmount(s: string) {
  const t = s.toLowerCase().replace(/[£,\s]/g, "");
  const m = t.match(/^(\d*\.?\d*)([km]?)$/);
  if (!m || !m[1] || m[1] === ".") return 0;
  return Number(m[1]) * (m[2] === "k" ? 1e3 : m[2] === "m" ? 1e6 : 1);
}

const fmt = (n: number, decimals: number) =>
  n ? n.toLocaleString("en-GB", { maximumFractionDigits: decimals }) : "";

/**
 * A number input that reads like money: thousands separators when you leave it, plain digits while you type.
 * Text, not type="number", so the keyboard, commas and pasting all behave.
 */
export function NumberField({ label, hint, value, onChange, prefix = "£", suffix, max = 10_000_000, decimals = 2, name }: {
  label: string; hint?: ReactNode; value: number; onChange: (n: number) => void; prefix?: string; suffix?: string; max?: number; decimals?: number; name: string;
}) {
  const id = useId();
  const [text, setText] = useState(() => fmt(value, decimals));
  const focused = useRef(false);
  // Follow outside changes (such as a value from the address bar) unless someone is typing.
  useEffect(() => { if (!focused.current) setText(fmt(value, decimals)); }, [value, decimals]);
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">{label}</label>
      <div className="field-box">
        {prefix && <span className="field-affix mr-1.5" aria-hidden>{prefix}</span>}
        <input
          id={id}
          name={name}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          enterKeyHint="done"
          value={text}
          placeholder="0"
          aria-describedby={hint ? `${id}-hint` : undefined}
          onFocus={() => { focused.current = true; setText(value ? String(value) : ""); }}
          onBlur={() => { focused.current = false; setText(fmt(value, decimals)); }}
          onChange={(e) => {
            setText(e.target.value);
            onChange(Math.min(max, parseAmount(e.target.value)));
          }}
        />
        {suffix && <span className="field-affix ml-1.5" aria-hidden>{suffix}</span>}
      </div>
      {hint && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
    </div>
  );
}

/** One choice from a few, as a segmented control (real radio buttons underneath). */
export function Segmented<T extends string>({ label, hint, value, onChange, options, name }: {
  label: string; hint?: ReactNode; value: T; onChange: (v: T) => void; options: [T, string][]; name: string;
}) {
  const id = useId();
  return (
    <fieldset className="field">
      <legend className="field-label mb-2">{label}</legend>
      <div className="seg">
        {options.map(([v, l]) => (
          <label key={v}>
            <input type="radio" name={`${id}-${name}`} value={v} checked={value === v} onChange={() => onChange(v)} />
            {l}
          </label>
        ))}
      </div>
      {hint && <p className="field-hint mt-2">{hint}</p>}
    </fieldset>
  );
}

/** Several independent choices, as pill toggles. */
export function Checks<T extends string>({ label, hint, value, onChange, options }: {
  label: string; hint?: ReactNode; value: T[]; onChange: (v: T[]) => void; options: [T, string][];
}) {
  return (
    <fieldset className="field">
      <legend className="field-label mb-2">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map(([v, l]) => (
          <label key={v} className="check">
            <input type="checkbox" checked={value.includes(v)} onChange={(e) => onChange(e.target.checked ? [...value, v] : value.filter((x) => x !== v))} />
            {l}
          </label>
        ))}
      </div>
      {hint && <p className="field-hint mt-2">{hint}</p>}
    </fieldset>
  );
}

export function SelectField<T extends string>({ label, hint, value, onChange, options }: {
  label: string; hint?: ReactNode; value: T; onChange: (v: T) => void; options: [T, string][];
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">{label}</label>
      <div className="field-box">
        <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)}>
          {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <svg viewBox="0 0 12 8" className="h-2 w-3 flex-none text-muted" aria-hidden><path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}

/** The headline result: a label, a big figure and a line under it. Announced politely to screen readers. */
export function ResultHero({ label, value, sub }: { label: string; value: string; sub?: ReactNode }) {
  return (
    <div aria-live="polite">
      <p className="kicker">{label}</p>
      <p className="result-figure mt-3">{value}</p>
      {sub && <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{sub}</p>}
    </div>
  );
}

export type Row = { label: ReactNode; value: string; color?: string; strong?: boolean };

export function ResultRows({ rows }: { rows: Row[] }) {
  return (
    <div className="result-rows">
      {rows.map((r, i) => (
        <div key={i} className="result-row" data-strong={r.strong || undefined}>
          <span className={r.strong ? "" : "text-muted"}>
            {r.color && <span className="dot" style={{ background: r.color }} aria-hidden />}
            {r.label}
          </span>
          <span>{r.value}</span>
        </div>
      ))}
    </div>
  );
}

/** How an amount splits, as one bar. Decorative: the rows carry the figures. */
export function SplitBar({ parts }: { parts: { value: number; color: string }[] }) {
  const shown = parts.filter((p) => p.value > 0);
  if (!shown.length) return <div className="split-bar" aria-hidden><span style={{ flexGrow: 1, background: "var(--hairline)" }} /></div>;
  return (
    <div className="split-bar" aria-hidden>
      {shown.map((p, i) => <span key={i} style={{ flexGrow: p.value, background: p.color }} />)}
    </div>
  );
}

/** A short note under the results. */
export function Note({ children }: { children: ReactNode }) {
  return <p className="text-[0.8125rem] leading-relaxed text-muted">{children}</p>;
}

/**
 * State mirrored in the address bar, so a result can be shared or bookmarked (`?salary=45000&region=scotland`).
 * The page renders with the defaults first and picks the address bar up after hydration.
 */
export function useQueryState<T extends Record<string, string | number | string[]>>(defaults: T) {
  const [state, setState] = useState<T>(defaults);
  const ready = useRef(false);
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const next = { ...defaults };
    for (const k of Object.keys(defaults) as (keyof T & string)[]) {
      const raw = q.get(k);
      if (raw === null) continue;
      const d = defaults[k];
      (next as Record<string, unknown>)[k] = Array.isArray(d) ? raw.split(",").filter(Boolean) : typeof d === "number" ? Math.max(0, Number(raw) || 0) : raw;
    }
    // Reading the address bar once, after hydration, is the point here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(next);
    ready.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!ready.current) return;
    const t = setTimeout(() => {
      const q = new URLSearchParams(location.search);
      for (const [k, v] of Object.entries(state)) {
        const s = Array.isArray(v) ? v.join(",") : String(v);
        if (s === (Array.isArray(defaults[k]) ? (defaults[k] as string[]).join(",") : String(defaults[k]))) q.delete(k);
        else q.set(k, s);
      }
      const url = `${location.pathname}${q.size ? `?${q}` : ""}${location.hash}`;
      history.replaceState(history.state, "", url);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  const set = <K extends keyof T>(k: K) => (v: T[K]) => setState((s) => ({ ...s, [k]: v }));
  return [state, set] as const;
}

export const COLORS = {
  keep: "var(--tool-income)",
  tax: "var(--tool-claims)",
  ni: "var(--tool-planning)",
  pension: "var(--pay-pension)",
  loan: "var(--faint)",
};
