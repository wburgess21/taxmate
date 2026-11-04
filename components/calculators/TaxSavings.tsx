"use client";

import { useEffect, useState } from "react";
import { RULES, gbp, paymentsOnAccount } from "@/lib/taxRules";
import { Note, NumberField, ResultHero, ResultRows, useQueryState } from "./fields";
import { Calc } from "./shared";

const Y = RULES.startYear;
const JAN = new Date(Y + 1, 0, 31), JUL = new Date(Y + 1, 6, 31);
const prev = `${Y - 1}/${String(Y).slice(2)}`, cur = RULES.taxYear;

/** Whole months from today to a date (at least one), or null once it has passed. Set after hydration. */
function useMonthsTo(date: Date) {
  const [months, setMonths] = useState<number | null>(null);
  useEffect(() => {
    const now = new Date();
    // The date comes from the visitor's clock, so it can only be read after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMonths(now > date ? null : Math.max(1, (date.getFullYear() - now.getFullYear()) * 12 + date.getMonth() - now.getMonth()));
  }, [date]);
  return months;
}

export function TaxSavingsCalculator() {
  const [s, set] = useQueryState({ bill: 6_000, paid: 4_000, paye: 0 });
  const poa = paymentsOnAccount(s.bill, s.paye);
  const balancing = Math.max(0, s.bill - s.paid);
  const jan = balancing + poa.each, jul = poa.each;
  const months = useMonthsTo(JAN);
  return (
    <Calc
      inputs={<>
        <NumberField name="bill" label={`Your ${prev} Self Assessment bill`} hint="Income Tax and Class 4 NI on your return, after tax already taken through PAYE." value={s.bill} onChange={set("bill")} />
        <NumberField name="paid" label={`Payments on account already made for ${prev}`} hint="What you paid in January and July towards this bill. Enter 0 if none." value={s.paid} onChange={set("paid")} />
        <NumberField name="paye" label="Tax taken at source" hint="PAYE on a salary or pension. If it covers more than 80% of your tax, you won’t need payments on account." value={s.paye} onChange={set("paye")} />
      </>}
      results={<>
        <ResultHero
          label="Due 31 January"
          value={gbp(jan)}
          sub={months ? <>Put aside <strong className="font-medium text-ink">{gbp(jan / months)}</strong> a month to have it ready.</> : `Your balancing payment for ${prev}${poa.needed ? ` and the first payment on account for ${cur}` : ""}.`}
        />
        <ResultRows rows={[
          { label: `31 Jan ${Y + 1}: balancing payment for ${prev}`, value: gbp(balancing) },
          { label: `31 Jan ${Y + 1}: 1st payment on account for ${cur}`, value: gbp(poa.each) },
          { label: `31 Jul ${Y + 1}: 2nd payment on account for ${cur}`, value: gbp(jul) },
          { label: "Total to pay", value: gbp(jan + jul), strong: true },
        ]} />
        <Note>
          {poa.needed
            ? `Each payment on account is half of your ${prev} bill. If you expect to earn less in ${cur}, you can ask HMRC to reduce them.`
            : `No payments on account: your bill is under ${gbp(RULES.paymentsOnAccount.minimumBill)}, or more than 80% of your tax is taken at source.`}
          {" "}Dates: {JAN.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} and {JUL.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.
        </Note>
      </>}
    />
  );
}
