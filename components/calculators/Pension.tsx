"use client";

import { RULES, gbp, pct, pensionRelief, type Region } from "@/lib/taxRules";
import { COLORS, Note, NumberField, Warning, ResultHero, ResultRows, Segmented, SplitBar, useQueryState } from "./fields";
import { Calc, REGIONS } from "./shared";

export function PensionCalculator() {
  const [s, set] = useQueryState({ income: 60_000, paid: 4_000, region: "rUK" as Region });
  const r = pensionRelief(s.income, s.paid, s.region);
  const card = s.paid >= 1 ? {
    kicker: `Pension tax relief · ${RULES.taxYear}`,
    lead: "My pension gets",
    amount: gbp(r.gross),
    sub: `and it costs me ${gbp(r.realCost)} once all the tax relief is in.`,
    tip: { lead: "Paying into a pension?", amount: "£80 → £100", sub: "Every £80 you pay in becomes £100, and higher-rate taxpayers can claim even more back." },
  } : null;
  return (
    <Calc
      card={card}
      inputs={<>
        <NumberField name="income" label="Your taxable income" hint="Salary, profit and other income for the year, before tax." value={s.income} onChange={set("income")} />
        <NumberField name="paid" label="What you pay into a personal pension" hint="The amount that leaves your bank account, such as a SIPP or a relief-at-source workplace scheme." value={s.paid} onChange={set("paid")} />
        <Segmented name="region" label="Where you pay tax" value={s.region} onChange={set("region")} options={REGIONS} />
      </>}
      results={<>
        <ResultHero label="Goes into your pension" value={gbp(r.gross)} sub={s.paid ? `It costs you ${gbp(r.realCost)} once all the relief is in: ${pct(r.totalRelief / r.gross)} of it comes from tax relief.` : "Enter what you pay in to see the relief."} />
        <SplitBar parts={[{ value: r.realCost, color: COLORS.pension }, { value: r.basic, color: COLORS.keep }, { value: r.extra, color: COLORS.tax }]} />
        <ResultRows rows={[
          { label: "You pay", value: gbp(s.paid), color: COLORS.pension },
          { label: "Basic rate relief added by your provider", value: gbp(r.basic), color: COLORS.keep },
          { label: "Extra relief through Self Assessment", value: gbp(r.extra), color: COLORS.tax },
          { label: "Real cost to you", value: gbp(r.realCost), strong: true },
        ]} />
        {r.overEarnings && (
          <Warning>
            Tax relief only covers payments up to your earnings ({gbp(r.limit)} gross{s.income < RULES.pensions.minimumRelief ? ", the minimum anyone can pay in with relief" : ""}). The figures only give relief on that much: tell your provider, as relief added on the rest will be taken back.
          </Warning>
        )}
        {r.tapered && (
          <Warning>Over {gbp(RULES.pensions.taperFrom)} your annual allowance may be lower than {gbp(RULES.pensions.annualAllowance)} (the tapered allowance). Check it before paying in large amounts.</Warning>
        )}
        <Note>
          {r.overAllowance ? `That’s over the ${gbp(RULES.pensions.annualAllowance)} annual allowance: you may be able to carry forward unused allowance from the last three years. ` : ""}
          Relief is limited to 100% of your earnings, or {gbp(RULES.pensions.minimumRelief)} gross if you earn less. If you earn between £100,000 and £125,140, contributions also win back your Personal Allowance, which the figures include.
        </Note>
      </>}
    />
  );
}
