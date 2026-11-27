import { RULES, gbp, pct, pence } from "./taxRules";

/**
 * The three figures each calculator's social image shows beside its headline, so a shared link previews as that
 * calculator rather than the homepage. Built from RULES, so they change with the tax year.
 */
export const SHARE_FACTS: Record<string, { heading: string; rows: [string, string][] }> = {
  "take-home-pay": { heading: `${RULES.taxYear} at a glance`, rows: [["Personal Allowance", gbp(RULES.personalAllowance)], ["Basic rate", pct(RULES.bands.rUK[0][1])], ["Employee NI", pct(RULES.employeeNI.main)]] },
  "self-employed-tax": { heading: `${RULES.taxYear} at a glance`, rows: [["Personal Allowance", gbp(RULES.personalAllowance)], ["Class 4 NI", pct(RULES.class4NI.main)], ["Trading allowance", gbp(RULES.tradingAllowance)]] },
  "combined-income": { heading: "Tax on a side income", rows: [["Basic rate", pct(RULES.bands.rUK[0][1])], ["Higher rate", pct(RULES.bands.rUK[1][1])], ["Class 4 NI", pct(RULES.class4NI.main)]] },
  "home-office": { heading: "Flat rate a month", rows: RULES.homeOffice.map(([min, monthly], i, all) => [i === all.length - 1 ? `${min}+ hours` : `${min}–${all[i + 1][0] - 1} hours`, gbp(monthly)]) },
  "business-expenses": { heading: "Each £1 of costs saves", rows: [["Basic rate", `${Math.round((RULES.bands.rUK[0][1] + RULES.class4NI.main) * 100)}p`], ["Higher rate", `${Math.round((RULES.bands.rUK[1][1] + RULES.class4NI.upper) * 100)}p`], ["Trading allowance", gbp(RULES.tradingAllowance)]] },
  "business-mileage": { heading: "Approved rates a mile", rows: [["Cars, first 10,000", pence(RULES.mileage.carFirst10k)], ["Cars, after that", pence(RULES.mileage.carAfter)], ["Motorcycles", pence(RULES.mileage.motorcycle)]] },
  "pension-contribution": { heading: "Tax relief on pensions", rows: [["Basic rate", pct(RULES.pensions.basicRelief)], ["Higher rate", pct(RULES.bands.rUK[1][1])], ["Annual allowance", gbp(RULES.pensions.annualAllowance)]] },
  "payments-on-account": { heading: "Self Assessment dates", rows: [["Balance + 1st payment", "31 Jan"], ["2nd payment", "31 Jul"], ["Needed from a bill of", gbp(RULES.paymentsOnAccount.minimumBill)]] },
  vat: { heading: "VAT at a glance", rows: [["Standard rate", pct(RULES.vat.standard)], ["Reduced rate", pct(RULES.vat.reduced)], ["Register over", gbp(RULES.vat.registration)]] },
  "making-tax-digital": { heading: "Required from", rows: RULES.mtd.map((m) => [`Over ${gbp(m.over)}`, `April ${m.from}`] as [string, string]) },
};
