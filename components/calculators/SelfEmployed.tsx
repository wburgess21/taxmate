"use client";

import { gbp, pct, selfEmployedTax, type Region } from "@/lib/taxRules";
import { COLORS, Note, NumberField, ResultHero, ResultRows, Segmented, SplitBar, useQueryState } from "./fields";
import { Calc, REGIONS } from "./shared";

export function SelfEmployedCalculator() {
  const [s, set] = useQueryState({ turnover: 45_000, expenses: 5_000, region: "rUK" as Region });
  const profit = Math.max(0, s.turnover - s.expenses);
  const r = selfEmployedTax(profit, s.region);
  const share = s.turnover ? r.total / s.turnover : 0;
  return (
    <Calc
      inputs={<>
        <NumberField name="turnover" label="Turnover" hint="Everything your business earned in the tax year, before costs." value={s.turnover} onChange={set("turnover")} />
        <NumberField name="expenses" label="Allowable expenses" hint="Business costs you can claim. If they’re under £1,000, the trading allowance may suit you better." value={s.expenses} onChange={set("expenses")} />
        <Segmented name="region" label="Where you pay tax" value={s.region} onChange={set("region")} options={REGIONS} />
      </>}
      results={<>
        <ResultHero label="Tax and NI to pay" value={gbp(r.total)} sub={<>Set aside about <strong className="font-medium text-ink">{pct(Math.ceil(share * 100) / 100)}</strong> of every payment you receive.</>} />
        <SplitBar parts={[{ value: r.keep, color: COLORS.keep }, { value: r.tax, color: COLORS.tax }, { value: r.ni, color: COLORS.ni }]} />
        <ResultRows rows={[
          { label: "Profit", value: gbp(profit) },
          { label: "Income Tax", value: gbp(r.tax), color: COLORS.tax },
          { label: "Class 4 National Insurance", value: gbp(r.ni), color: COLORS.ni },
          { label: "You keep", value: gbp(r.keep), color: COLORS.keep, strong: true },
        ]} />
        <Note>
          Your next £1 of profit costs {pct(r.marginal)} in tax and NI. If your bill is over £1,000 you’ll usually also make payments on account towards next year.
          Assumes this is your only income.
        </Note>
      </>}
    />
  );
}
