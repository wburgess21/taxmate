import { FAQ, PLUS } from "./content";
import { APP_DESCRIPTION } from "./schema";
import { APP_STORE_URL, CONTACT_EMAIL, SITE_URL, TAX_YEAR } from "./site";
import { GROUPS } from "./tools";
import { CALCULATORS, type Block } from "./calculators";
import { AUDIENCES } from "./audiences";
import { ALL_KEY_DATES, AUDIENCE_LABEL } from "./keyDates";
import { RULES, gbp, pct, pence } from "./taxRules";

/** A section of links in llms.txt: `[title](url): note`. */
export type LlmsSection = { title: string; links: { title: string; url: string; note?: string }[] };

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const checked = () => { const [y, m, d] = RULES.checked.split("-").map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };

/** The figures people most often ask about, as short quotable lines. Every value comes from lib/taxRules.ts. */
export function keyFigures() {
  const r = RULES;
  const sl = Object.values(r.studentLoans).map((l) => `${l.label} ${gbp(l.threshold)}`).join(", ");
  return [
    `Personal Allowance: ${gbp(r.personalAllowance)}, reduced by £1 for every £2 of adjusted net income over ${gbp(r.allowanceTaperFrom)} (gone at £125,140).`,
    `Income Tax (England, Wales and Northern Ireland): 20% on £12,571 to £50,270, 40% on £50,271 to £125,140, 45% above.`,
    `Income Tax (Scotland): 19%, 20%, 21%, 42%, 45% and 48%; the higher rate starts at £43,663 and the advanced rate at £75,001.`,
    `Employee National Insurance: ${pct(r.employeeNI.main)} on earnings from ${gbp(r.employeeNI.primaryThreshold)} to ${gbp(r.employeeNI.upperEarningsLimit)}, ${pct(r.employeeNI.upper)} above.`,
    `Self-employed Class 4 National Insurance: ${pct(r.class4NI.main)} on profits from ${gbp(r.class4NI.lowerProfitsLimit)} to ${gbp(r.class4NI.upperProfitsLimit)}, ${pct(r.class4NI.upper)} above. Class 2 is voluntary.`,
    `Employer National Insurance: ${pct(r.employerNI.rate)} above ${gbp(r.employerNI.secondaryThreshold)}; Employment Allowance ${gbp(r.employerNI.employmentAllowance)}.`,
    `Student loan thresholds (9%, postgraduate 6%): ${sl}.`,
    `Dividends: ${gbp(r.dividends.allowance)} allowance, then ${pct(r.dividends.basic, 2)}, ${pct(r.dividends.higher, 2)} and ${pct(r.dividends.additional, 2)}.`,
    `Capital Gains Tax: ${gbp(r.capitalGains.annualExempt)} exempt, then ${pct(r.capitalGains.basic)} or ${pct(r.capitalGains.higher)}.`,
    `Pension annual allowance: ${gbp(r.pensions.annualAllowance)}. Relief at source adds 20%; higher and additional rate relief is claimed through Self Assessment.`,
    `Trading and property allowances: ${gbp(r.tradingAllowance)} each.`,
    `VAT: ${pct(r.vat.standard)} standard, ${pct(r.vat.reduced)} reduced; registration when taxable turnover goes over ${gbp(r.vat.registration)} in any rolling 12 months; deregistration below ${gbp(r.vat.deregistration)}.`,
    `Approved mileage rates: cars and vans ${pence(r.mileage.carFirst10k)} a mile for the first 10,000 business miles from 6 April 2026 (45p before), then ${pence(r.mileage.carAfter)}; motorcycles ${pence(r.mileage.motorcycle)}; bicycles ${pence(r.mileage.bicycle)}; passengers ${pence(r.mileage.passenger)}.`,
    `Working from home (self-employed flat rate): £10 a month for 25 to 50 hours, £18 for 51 to 100, £26 for 101 or more (at most £312 a year), or a reasonable business share of actual household costs. Employees can no longer claim the £6 a week from HMRC themselves from 6 April 2026.`,
    `Payments on account: two, each half of the last Self Assessment bill, due 31 January and 31 July, unless the bill was under ${gbp(r.paymentsOnAccount.minimumBill)} or more than 80% of tax was collected at source.`,
    `Making Tax Digital for Income Tax: qualifying income (gross self-employment plus property income) over £50,000 from 6 April 2026, over £30,000 from 6 April 2027, over £20,000 from 6 April 2028.`,
    `Corporation Tax: ${pct(r.corporationTax.small)} up to ${gbp(r.corporationTax.smallProfitsLimit)}, ${pct(r.corporationTax.main)} over ${gbp(r.corporationTax.mainRateFrom)}, with marginal relief between.`,
    `High Income Child Benefit Charge: from ${gbp(r.childBenefitCharge.from)}, the whole benefit by ${gbp(r.childBenefitCharge.to)}.`,
  ];
}

const intro = () => [
  "# TaxMate",
  "",
  `> ${APP_DESCRIPTION}`,
  "",
  "TaxMate is an independent iPhone and iPad app for people who pay tax in the UK. It is not affiliated with HMRC and does not give tax advice: it turns published HMRC rules into clear estimates.",
  "",
  `This website also offers free web calculators that use the same rules as the app, a ${TAX_YEAR} rates and thresholds page, an HMRC key dates calendar you can subscribe to, guides by situation and a blog. The calculators run in the browser: nothing typed into them is sent anywhere. Figures last checked ${checked()}.`,
  "",
];

/**
 * The site as plain Markdown for language models and agents (https://llmstxt.org): what TaxMate is, the facts worth
 * quoting, and links to the pages that go deeper. Pages added to the site contribute sections, so it stays complete.
 */
export function llmsTxt(sections: LlmsSection[] = []) {
  const lines: string[] = [
    ...intro(),
    "## Key facts",
    "",
    `- Platform: iPhone and iPad (iOS and iPadOS). App Store: ${APP_STORE_URL}`,
    "- Price: free to download, and every calculator gives a free estimate. TaxMate Plus is a single one-time in-app purchase. There is no subscription.",
    "- Privacy: no account or sign-up. Calculations are stored on the device and not sent to TaxMate. No analytics, advertising or tracking code in the app.",
    `- Tax year: estimates use ${TAX_YEAR} HMRC rates and thresholds, including Scottish Income Tax bands, and are updated each tax year.`,
    "- For: employees, sole traders and freelancers, company directors, landlords, and people with a salary and side income.",
    `- Free on the web: ${CALCULATORS.length} calculators at ${SITE_URL}/calculators, with no sign-up.`,
    `- Contact: ${CONTACT_EMAIL}`,
    "",
    `## ${TAX_YEAR} key figures`,
    "",
    ...keyFigures().map((f) => `- ${f}`),
    "",
    "## Tools in the app",
    "",
  ];
  for (const g of GROUPS) {
    lines.push(`### ${g.title}`, "", g.summary, "");
    for (const t of g.tools) lines.push(`- ${t.title}: ${t.benefit}`);
    lines.push("");
  }
  lines.push("## TaxMate Plus (one-time purchase)", "", ...PLUS.map((p) => `- ${p}`), "");
  lines.push("## Questions", "");
  for (const f of FAQ) lines.push(`### ${f.q}`, "", f.a, "");
  for (const s of sections) {
    if (!s.links.length) continue;
    lines.push(`## ${s.title}`, "", ...s.links.map((l) => `- [${l.title}](${l.url})${l.note ? `: ${l.note}` : ""}`), "");
  }
  lines.push(
    "## Optional",
    "",
    `- [Full text of every calculator, guide, rate and date](${SITE_URL}/llms-full.txt)`,
    `- [Home page](${SITE_URL}/): the tour of the app, a salary splitter and the key dates`,
    `- [Privacy policy](${SITE_URL}/privacy)`,
    `- [Terms of use](${SITE_URL}/terms)`,
    "",
  );
  return lines.join("\n");
}

const blocks = (bs: Block[]) => bs.flatMap((b) => [`### ${b.h}`, "", ...(b.p ?? []).flatMap((p) => [p, ""]), ...(b.ul ?? []).map((li) => `- ${li}`), ...(b.ul ? [""] : [])]);
const faq = (items: { q: string; a: string }[]) => items.flatMap((f) => [`**${f.q}** ${f.a}`, ""]);

/**
 * Everything an agent needs to answer UK tax questions from this site in one plain-text file: the key figures,
 * every calculator's explanation and FAQ, the guides, and the calendar. Linked from llms.txt.
 */
export function llmsFullTxt(posts: { title: string; slug: string; excerpt: string }[] = []) {
  const lines: string[] = [...intro(), `## ${TAX_YEAR} key figures`, "", ...keyFigures().map((f) => `- ${f}`), ""];
  lines.push("## Calculators", "", `Each calculator is free at ${SITE_URL}/calculators/<name>, and its inputs can be set in the address, for example ${SITE_URL}/calculators/take-home-pay?salary=45000&region=scotland.`, "");
  for (const c of CALCULATORS) {
    lines.push(`## ${c.name} calculator`, "", `${calcLine(c.slug)}`, "", c.description, "", ...blocks(c.body), "#### Questions", "", ...faq(c.faq), `In the app, the ${c.tool} tool adds: ${c.inApp.join("; ")}.`, "");
  }
  lines.push("## Guides by situation", "");
  for (const a of AUDIENCES) {
    lines.push(`## ${a.title}`, "", `${SITE_URL}/for/${a.slug}`, "", a.description, "", ...a.facts.map((f) => `- ${f.figure}: ${f.label}`), "", ...blocks(a.body), "#### Questions", "", ...faq(a.faq));
  }
  lines.push("## HMRC key dates (every year)", "", `Subscribe: ${SITE_URL}/key-dates.ics (iCalendar). Page: ${SITE_URL}/key-dates`, "");
  for (const d of [...ALL_KEY_DATES].sort((x, y) => x.month - y.month || x.day - y.day)) lines.push(`- ${d.day} ${MONTHS[d.month - 1]}: ${d.title} (${AUDIENCE_LABEL[d.who]}). ${d.detail}`);
  lines.push("");
  if (posts.length) {
    lines.push("## Blog", "", ...posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`), "");
  }
  lines.push("## About TaxMate", "", ...faq(FAQ), `App Store: ${APP_STORE_URL}`, "");
  return lines.join("\n");
}

const calcLine = (slug: string) => `${SITE_URL}/calculators/${slug}`;
