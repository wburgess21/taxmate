"use client";

import { RULES, gbp, pct, takeHomePay, type Region, type StudentLoanPlan } from "@/lib/taxRules";
import { COLORS, Checks, Note, NumberField, ResultHero, ResultRows, Segmented, SplitBar, useQueryState } from "./fields";
import { Calc, PERIODS, REGIONS, per, perLabel, type Period } from "./shared";

const PLANS = Object.entries(RULES.studentLoans).map(([k, v]) => [k, v.label]) as [StudentLoanPlan, string][];

export function TakeHomePayCalculator() {
  const [s, set] = useQueryState({ salary: 35_000, region: "rUK" as Region, pension: 5, loans: [] as StudentLoanPlan[], period: "month" as Period });
  const r = takeHomePay({ salary: s.salary, region: s.region, pensionPct: s.pension, plans: s.loans });
  const p = (n: number) => gbp(per(n, s.period));
  const taper = s.salary - r.pension > RULES.allowanceTaperFrom && s.salary - r.pension < 125_140;
  return (
    <Calc
      inputs={<>
        <NumberField name="salary" label="Salary before tax" hint="Your annual pay, including any regular bonus." value={s.salary} onChange={set("salary")} />
        <Segmented name="region" label="Where you pay tax" value={s.region} onChange={set("region")} options={REGIONS} />
        <NumberField name="pension" label="Workplace pension" prefix="" suffix="% of salary" decimals={1} max={100} value={s.pension} onChange={set("pension")} hint="Taken before tax. Enter 0 if you don’t pay in." />
        <Checks label="Student loans" value={s.loans} onChange={set("loans")} options={PLANS} hint="Choose any you’re repaying through payroll." />
      </>}
      results={<>
        <Segmented name="period" label="Show figures for" value={s.period} onChange={set("period")} options={PERIODS} />
        <ResultHero label={`Take-home ${perLabel(s.period)}`} value={p(r.keep)} sub={`${gbp(r.keep)} a year, ${s.salary ? pct(r.keep / s.salary) : "0%"} of your salary.`} />
        <SplitBar parts={[{ value: r.keep, color: COLORS.keep }, { value: r.tax, color: COLORS.tax }, { value: r.ni, color: COLORS.ni }, { value: r.pension, color: COLORS.pension }, { value: r.loan, color: COLORS.loan }]} />
        <ResultRows rows={[
          { label: "Salary", value: p(s.salary) },
          { label: "Income Tax", value: p(r.tax), color: COLORS.tax },
          { label: "National Insurance", value: p(r.ni), color: COLORS.ni },
          ...(r.pension ? [{ label: "Pension", value: p(r.pension), color: COLORS.pension }] : []),
          ...(r.loan ? [{ label: "Student loan", value: p(r.loan), color: COLORS.loan }] : []),
          { label: "Take-home", value: p(r.keep), color: COLORS.keep, strong: true },
        ]} />
        <Note>
          {taper
            ? `Between £100,000 and £125,140 your Personal Allowance shrinks, so each extra £1 is taxed at ${pct(r.marginal)}. Paying more into your pension can bring it back.`
            : `Your next £1 of pay is taxed at ${pct(r.marginal)} Income Tax. Your Personal Allowance is ${gbp(r.allowance)}.`}
          {" "}Assumes a standard tax code and a net pay pension.
        </Note>
      </>}
    />
  );
}
