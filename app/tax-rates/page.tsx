import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RULES, gbp, pct } from "@/lib/taxRules";
import { SITE_URL } from "@/lib/site";
import { ORG_ID, WEBSITE_ID } from "@/lib/schema";
import { InnerPage, PageHeading } from "@/components/site/InnerPage";
import { JsonLd } from "@/components/site/JsonLd";
import { AppCta } from "@/components/site/AppCta";

const Y = RULES.taxYear;
const title = `UK Tax Rates and Thresholds ${Y}`;
const description = `Every UK tax rate and threshold for ${Y} on one page: Income Tax bands (including Scotland), National Insurance, student loans, dividends, savings, Capital Gains Tax, pensions, VAT, mileage rates and Making Tax Digital.`;
/** Bump when the figures are checked. */
const UPDATED = "2026-11-03";

export const metadata: Metadata = {
  title: { absolute: `${title} · TaxMate` },
  description,
  alternates: { canonical: "/tax-rates" },
  openGraph: { title, description, url: "/tax-rates", type: "article" },
};

type Table = { head: string[]; rows: (string | number)[][]; note?: string };
type Section = { id: string; title: string; intro?: string; tables: Table[]; calc?: [string, string] };

const PA = RULES.personalAllowance;

/** Gross income ranges for each band, assuming the full Personal Allowance. */
function bandRows(region: "rUK" | "scotland") {
  const bands = RULES.bands[region];
  let lower: number = PA;
  const rows: string[][] = [["Personal Allowance", `Up to ${gbp(PA)}`, "0%"]];
  bands.forEach(([upper, rate, name], i) => {
    const last = i === bands.length - 1;
    const top = upper + PA;
    // The highest bands start at £125,140, where the allowance has gone.
    const range = last ? `Over ${gbp(bands[i - 1][0])}` : upper >= 125_140 ? `${gbp(lower + 1)} to ${gbp(upper)}` : `${gbp(lower + 1)} to ${gbp(top)}`;
    rows.push([name, range, pct(rate)]);
    lower = top;
  });
  return rows;
}

const SL = Object.values(RULES.studentLoans);

const SECTIONS: Section[] = [
  {
    id: "income-tax",
    title: "Income Tax: England, Wales and Northern Ireland",
    intro: `The Personal Allowance falls by £1 for every £2 of adjusted net income over ${gbp(RULES.allowanceTaperFrom)}, and is gone at £125,140. Thresholds are frozen until April 2031.`,
    tables: [{ head: ["Band", "Taxable income", "Rate"], rows: bandRows("rUK") }],
    calc: ["take-home-pay", "Take-home pay calculator"],
  },
  {
    id: "scotland",
    title: "Income Tax: Scotland",
    intro: "Scottish rates apply to earnings, pensions and profits for Scottish taxpayers. Savings and dividends use UK rates.",
    tables: [{ head: ["Band", "Taxable income", "Rate"], rows: bandRows("scotland") }],
    calc: ["take-home-pay", "Take-home pay calculator"],
  },
  {
    id: "national-insurance",
    title: "National Insurance",
    tables: [
      { head: ["Employees (Class 1)", "Earnings a year", "Rate"], rows: [["Below the Primary Threshold", `Up to ${gbp(RULES.employeeNI.primaryThreshold)}`, "0%"], ["Main rate", `${gbp(RULES.employeeNI.primaryThreshold + 1)} to ${gbp(RULES.employeeNI.upperEarningsLimit)}`, pct(RULES.employeeNI.main)], ["Above the Upper Earnings Limit", `Over ${gbp(RULES.employeeNI.upperEarningsLimit)}`, pct(RULES.employeeNI.upper)]] },
      { head: ["Self-employed (Class 4)", "Profit a year", "Rate"], rows: [["Below the Lower Profits Limit", `Up to ${gbp(RULES.class4NI.lowerProfitsLimit)}`, "0%"], ["Main rate", `${gbp(RULES.class4NI.lowerProfitsLimit + 1)} to ${gbp(RULES.class4NI.upperProfitsLimit)}`, pct(RULES.class4NI.main)], ["Above the Upper Profits Limit", `Over ${gbp(RULES.class4NI.upperProfitsLimit)}`, pct(RULES.class4NI.upper)]], note: "Class 2 is voluntary: you can pay it to protect your State Pension record." },
      { head: ["Employers (secondary Class 1)", "Earnings a year", "Rate"], rows: [["Secondary Threshold", `Over ${gbp(RULES.employerNI.secondaryThreshold)}`, pct(RULES.employerNI.rate)], ["Employment Allowance", "Off the employer’s bill", gbp(RULES.employerNI.employmentAllowance)]] },
    ],
    calc: ["self-employed-tax", "Self-employed tax calculator"],
  },
  {
    id: "allowances",
    title: "Allowances",
    tables: [{
      head: ["Allowance", "Amount"],
      rows: [
        ["Personal Allowance", gbp(PA)],
        ["Marriage Allowance (transferable)", gbp(RULES.marriageAllowance)],
        ["Trading allowance", gbp(RULES.tradingAllowance)],
        ["Property allowance", gbp(RULES.propertyAllowance)],
        ["Dividend allowance", gbp(RULES.dividends.allowance)],
        ["Personal Savings Allowance: basic rate", gbp(RULES.savings.allowanceBasic)],
        ["Personal Savings Allowance: higher rate", gbp(RULES.savings.allowanceHigher)],
        ["Starting rate for savings (up to)", gbp(RULES.savings.startingRate)],
        ["Capital Gains Tax annual exempt amount", gbp(RULES.capitalGains.annualExempt)],
        ["ISA allowance", gbp(RULES.isaAllowance)],
        ["Pension annual allowance", gbp(RULES.pensions.annualAllowance)],
      ],
    }],
  },
  {
    id: "dividends-savings-gains",
    title: "Dividends and Capital Gains Tax",
    tables: [
      { head: ["Dividends", "Rate"], rows: [["Basic rate", pct(RULES.dividends.basic, 2)], ["Higher rate", pct(RULES.dividends.higher, 2)], ["Additional rate", pct(RULES.dividends.additional, 2)]] },
      { head: ["Capital Gains Tax", "Rate"], rows: [["Basic rate taxpayers", pct(RULES.capitalGains.basic)], ["Higher and additional rate taxpayers", pct(RULES.capitalGains.higher)]] },
    ],
  },
  {
    id: "student-loans",
    title: "Student loan repayments",
    tables: [{ head: ["Plan", "Threshold a year", "Rate above it"], rows: SL.map((l) => [l.label, gbp(l.threshold), pct(l.rate)]) }],
    calc: ["take-home-pay", "Take-home pay calculator"],
  },
  {
    id: "child-benefit",
    title: "High Income Child Benefit Charge",
    intro: `The charge is 1% of your Child Benefit for every £200 of adjusted net income over ${gbp(RULES.childBenefitCharge.from)}, so it cancels the benefit completely at ${gbp(RULES.childBenefitCharge.to)}.`,
    tables: [],
  },
  {
    id: "vat",
    title: "VAT",
    tables: [{ head: ["", "Amount"], rows: [["Standard rate", pct(RULES.vat.standard)], ["Reduced rate", pct(RULES.vat.reduced)], ["Zero rate", "0%"], ["Registration threshold", gbp(RULES.vat.registration)], ["Deregistration threshold", gbp(RULES.vat.deregistration)]] }],
    calc: ["vat", "VAT calculator"],
  },
  {
    id: "mileage",
    title: "Approved mileage rates",
    tables: [{ head: ["Vehicle", "Rate a business mile"], rows: [["Cars and vans: first 10,000 miles", "45p"], ["Cars and vans: after 10,000 miles", "25p"], ["Motorcycles", "24p"], ["Bicycles", "20p"], ["Each passenger (employer payments)", "5p"]] }],
    calc: ["business-mileage", "Business mileage calculator"],
  },
  {
    id: "home-office",
    title: "Working from home: simplified expenses",
    tables: [{ head: ["Hours worked at home in the month", "Flat rate a month"], rows: [["25 to 50", "£10"], ["51 to 100", "£18"], ["101 or more", "£26"]] }],
    calc: ["home-office", "Home office calculator"],
  },
  {
    id: "corporation-tax",
    title: "Corporation Tax",
    tables: [{ head: ["Taxable profit", "Rate"], rows: [[`Up to ${gbp(RULES.corporationTax.smallProfitsLimit)}`, pct(RULES.corporationTax.small)], [`${gbp(RULES.corporationTax.smallProfitsLimit + 1)} to ${gbp(RULES.corporationTax.mainRateFrom)}`, "25%, less marginal relief"], [`Over ${gbp(RULES.corporationTax.mainRateFrom)}`, pct(RULES.corporationTax.main)]] }],
  },
  {
    id: "making-tax-digital",
    title: "Making Tax Digital for Income Tax",
    intro: "Qualifying income is gross self-employment and property income, before expenses.",
    tables: [{ head: ["Qualifying income", "Measured on", "Required from"], rows: RULES.mtd.map((m) => [`Over ${gbp(m.over)}`, `${m.basedOn} return`, `6 April ${m.from}`]) }],
    calc: ["making-tax-digital", "Making Tax Digital checker"],
  },
];

export default function TaxRates() {
  return (
    <InnerPage tint="var(--tool-planning)" crumbs={[["Tax rates", "/tax-rates"]]}>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        url: `${SITE_URL}/tax-rates`,
        dateModified: UPDATED,
        inLanguage: "en-GB",
        isPartOf: { "@id": WEBSITE_ID },
        author: { "@id": ORG_ID },
        publisher: { "@id": ORG_ID },
      }} />
      <PageHeading kicker={`Tax year 6 April ${RULES.startYear} to 5 April ${RULES.startYear + 1}`} h1={["Tax rates", `for ${Y}.`]} lede="Every rate and threshold you’re likely to need this tax year, on one page. Checked against GOV.UK and the same figures the TaxMate app uses.">
        <p className="mt-4 text-[0.875rem] text-muted">Last checked <time dateTime={UPDATED}>{new Date(UPDATED).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</time></p>
      </PageHeading>

      <div className="mx-auto mt-14 grid max-w-[1240px] grid-cols-[minmax(0,1fr)] gap-14 px-5 sm:px-8 lg:mt-20 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20">
        <nav aria-label="On this page" className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="kicker">On this page</h2>
          <ol className="mt-4 grid gap-2.5 text-[0.9375rem] max-lg:grid-cols-2 max-lg:gap-x-6">
            {SECTIONS.map((s) => <li key={s.id}><a href={`#${s.id}`} className="text-muted transition-colors hover:text-ink">{s.title.replace(/^Income Tax: /, "Income Tax, ")}</a></li>)}
          </ol>
        </nav>
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-6">
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="surface-card scroll-mt-28 p-6 sm:p-9">
              <h2 id={`${s.id}-h`} className="text-2xl font-light tracking-tight sm:text-[1.75rem]">{s.title}</h2>
              {s.intro && <p className="mt-3 max-w-2xl leading-relaxed text-muted">{s.intro}</p>}
              {s.tables.map((t, i) => (
                <div key={i} className="table-wrap mt-6">
                  <table className="data-table">
                    <thead><tr>{t.head.map((h, j) => <th key={j} scope="col" className={j === t.head.length - 1 ? "num" : ""}>{h}</th>)}</tr></thead>
                    <tbody>{t.rows.map((r, k) => <tr key={k}>{r.map((c, j) => j === 0 ? <th key={j} scope="row" className="font-normal">{c}</th> : <td key={j} className={j === r.length - 1 ? "num font-medium" : "text-muted"}>{c}</td>)}</tr>)}</tbody>
                  </table>
                  {t.note && <p className="mt-3 text-[0.875rem] text-muted">{t.note}</p>}
                </div>
              ))}
              {s.calc && (
                <Link href={`/calculators/${s.calc[0]}`} className="mt-6 inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-accent underline-offset-4 hover:underline">
                  {s.calc[1]} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              )}
            </section>
          ))}
        </div>
      </div>

      <AppCta title={["These rates,", "applied to you."]} body="TaxMate turns this year’s rules into your own figures: what you’ll take home, what you’ll owe and when, kept on your iPhone." placement="tax-rates" />
    </InnerPage>
  );
}
