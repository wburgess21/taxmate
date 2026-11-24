import { TAX_YEAR } from "./site";

/** What TaxMate Plus unlocks. */
export const PLUS = [
  "Home Office reports",
  "Saved tax savings plans",
  "Manual journey logs",
  "Named expense comparisons",
  "Annual PDF and CSV summaries",
  "Pension comparisons",
  "Combined-income planning",
  "Rolling VAT monitoring",
  "Plan and VAT reminders",
];

/** The home page questions, also published as FAQPage structured data and in llms.txt. */
export const FAQ = [
  { q: "Is TaxMate free?", a: "Yes. It’s free to download, and every calculator gives you a free estimate. TaxMate Plus is a single, one-time purchase that unlocks saved reports, plans, journey logs, exports and monitoring. There’s no subscription." },
  { q: "Where are my answers and calculations stored?", a: "On your device. There’s no account to create, and your calculations aren’t sent to us. Deadline reminders are scheduled locally on your iPhone or iPad." },
  { q: "Which tax year does it use?", a: `Estimates use ${TAX_YEAR} HMRC rates and thresholds, including Scottish Income Tax bands. The rules are checked against GOV.UK guidance and updated for each new tax year.` },
  { q: "Who is TaxMate for?", a: "Employees checking their pay, sole traders and freelancers, company directors, landlords, and anyone with a salary and side income. Answer a few questions and TaxMate brings forward the tools that fit you." },
  { q: "Is this tax advice? Is TaxMate affiliated with HMRC?", a: "No to both. TaxMate is an independent planning tool built on published HMRC guidance. Estimates depend on the figures you enter, so keep your records and check anything important with HMRC or an accountant." },
  { q: "Can I share results with my accountant?", a: "Yes. Results can be shared, and with Plus the Annual Summary exports your selected planning records as a PDF or CSV." },
];
