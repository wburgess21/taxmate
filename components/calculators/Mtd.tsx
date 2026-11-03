"use client";

import { RULES, gbp, mtdStart } from "@/lib/taxRules";
import { Note, NumberField, ResultHero, ResultRows, useQueryState } from "./fields";
import { Calc } from "./shared";

export function MtdCalculator() {
  const [s, set] = useQueryState({ trading: 38_000, property: 0 });
  const income = s.trading + s.property;
  const m = mtdStart(income);
  return (
    <Calc
      inputs={<>
        <NumberField name="trading" label="Self-employed turnover" hint="Your gross income from self-employment, before expenses. Add up all your businesses." value={s.trading} onChange={set("trading")} />
        <NumberField name="property" label="Property income" hint="Gross rent from UK and overseas property, before expenses." value={s.property} onChange={set("property")} />
      </>}
      results={<>
        <ResultHero
          label="Making Tax Digital for Income Tax"
          value={m ? `From April ${m.from}` : "Not yet"}
          sub={m ? `Your qualifying income of ${gbp(income)} is over ${gbp(m.over)}. HMRC will check this on your ${m.basedOn} tax return.` : `Qualifying income of ${gbp(income)} is under ${gbp(RULES.mtd[RULES.mtd.length - 1].over)}, so you don’t have to join yet.`}
        />
        <ResultRows rows={[
          ...RULES.mtd.map((t) => ({ label: `Over ${gbp(t.over)} on your ${t.basedOn} return`, value: `6 April ${t.from}`, strong: m?.from === t.from })),
        ]} />
        <Note>Once you’re in, you keep digital records in compatible software, send a quarterly update to HMRC, and file your return through the same software by 31 January. Employment income and pensions don’t count towards the threshold.</Note>
      </>}
    />
  );
}
