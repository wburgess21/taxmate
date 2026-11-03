import { gbp, selfEmployedTax, takeHomePay } from "@/lib/taxRules";

const SALARIES = [20_000, 25_000, 30_000, 35_000, 40_000, 45_000, 50_000, 60_000, 70_000, 80_000, 100_000, 125_000, 150_000];
const PROFITS = [15_000, 20_000, 30_000, 40_000, 50_000, 60_000, 80_000, 100_000];

/**
 * Worked figures rendered on the server, so search engines and agents can read real numbers without running the
 * calculator. Each page that has one shows it under the calculator.
 */
export const hasExamples = (slug: string) => slug === "take-home-pay" || slug === "self-employed-tax";

export function Examples({ slug }: { slug: string }) {
  if (slug === "take-home-pay") {
    return (
      <Table
        caption="Take-home pay at common salaries in England, Wales and Northern Ireland, with no pension or student loan."
        head={["Salary", "Income Tax", "National Insurance", "Take-home a year", "A month"]}
        rows={SALARIES.map((s) => { const r = takeHomePay({ salary: s, region: "rUK" }); return [gbp(s), gbp(r.tax), gbp(r.ni), gbp(r.keep), gbp(r.keep / 12)]; })}
      />
    );
  }
  if (slug === "self-employed-tax") {
    return (
      <Table
        caption="Tax on self-employed profit in England, Wales and Northern Ireland, with no other income."
        head={["Profit", "Income Tax", "Class 4 NI", "Total", "You keep"]}
        rows={PROFITS.map((p) => { const r = selfEmployedTax(p, "rUK"); return [gbp(p), gbp(r.tax), gbp(r.ni), gbp(r.total), gbp(r.keep)]; })}
      />
    );
  }
  return null;
}

/** Columns 1 and 2 (the tax breakdown) are left out on phones, so the table fits without scrolling. */
function Table({ caption, head, rows }: { caption: string; head: string[]; rows: string[][] }) {
  const cls = (i: number) => (i ? "num" : "") + (i === 1 || i === 2 ? " max-sm:hidden" : "");
  return (
    <div className="surface-card p-5 sm:p-8">
      <div className="table-wrap">
        <table className="data-table">
          <caption className="mb-4 text-left text-[0.9375rem] leading-relaxed text-muted">{caption}</caption>
          <thead><tr>{head.map((h, i) => <th key={h} scope="col" className={cls(i)}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((r) => <tr key={r[0]}>{r.map((c, i) => i ? <td key={i} className={cls(i)}>{c}</td> : <th key={i} scope="row" className="font-medium">{c}</th>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
