"use client";

import { RULES, gbp, vatSplit } from "@/lib/taxRules";
import { Note, NumberField, ResultHero, ResultRows, Segmented, useQueryState } from "./fields";
import { Calc } from "./shared";

const RATES: [string, string][] = [["0.2", "20% standard"], ["0.05", "5% reduced"], ["0", "0% zero"]];

export function VatCalculator() {
  const [s, set] = useQueryState({ mode: "add" as "add" | "remove", amount: 1_000, rate: "0.2", turnover: 70_000 });
  const r = vatSplit(s.amount, Number(s.rate), s.mode);
  const left = RULES.vat.registration - s.turnover;
  return (
    <div className="grid gap-6">
      <Calc
        inputs={<>
          <Segmented name="mode" label="I want to" value={s.mode} onChange={set("mode")} options={[["add", "Add VAT"], ["remove", "Remove VAT"]]} />
          <NumberField name="amount" label={s.mode === "add" ? "Price before VAT" : "Price including VAT"} value={s.amount} onChange={set("amount")} />
          <Segmented name="rate" label="VAT rate" value={s.rate} onChange={set("rate")} options={RATES} />
        </>}
        results={<>
          <ResultHero label={s.mode === "add" ? "Price with VAT" : "Price before VAT"} value={gbp(s.mode === "add" ? r.gross : r.net, true)} sub={`VAT: ${gbp(r.vat, true)}`} />
          <ResultRows rows={[
            { label: "Net", value: gbp(r.net, true) },
            { label: "VAT", value: gbp(r.vat, true) },
            { label: "Gross", value: gbp(r.gross, true), strong: true },
          ]} />
          <Note>To remove 20% VAT, divide by 1.2, not take off 20%. £120 including VAT is £100 plus £20 VAT.</Note>
        </>}
      />
      <Calc
        inputs={<>
          <NumberField name="turnover" label="VAT-taxable turnover in the last 12 months" hint="A rolling 12 months, not your tax year. Leave out exempt and out-of-scope sales." value={s.turnover} onChange={set("turnover")} />
        </>}
        results={<>
          <ResultHero
            label="VAT registration"
            value={left > 0 ? `${gbp(left)} to go` : "Register now"}
            sub={left > 0 ? `You’re under the ${gbp(RULES.vat.registration)} threshold. Check again every month.` : `You’ve gone over ${gbp(RULES.vat.registration)}. Register within 30 days of the end of the month you went over.`}
          />
          <Note>You also have to register straight away if you expect to go over {gbp(RULES.vat.registration)} in the next 30 days alone. You can deregister if turnover drops below {gbp(RULES.vat.deregistration)}.</Note>
        </>}
      />
    </div>
  );
}
