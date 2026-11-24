/** The app's key dates (CalculatorCatalogView.swift), repeating every tax year. */
export const KEY_DATES = [
  { month: 1, day: 31, title: "Self Assessment deadline", detail: "File your online return and pay the tax you owe." },
  { month: 4, day: 5, title: "Tax year ends", detail: "Last day to use this year's allowances and relief." },
  { month: 7, day: 31, title: "Second payment on account", detail: "Pay towards this year's Self Assessment bill." },
  { month: 10, day: 5, title: "Register for Self Assessment", detail: "If you started working for yourself last tax year." },
  { month: 10, day: 31, title: "Paper return deadline", detail: "Filing online? You have until 31 January." },
];

export function upcomingKeyDates(now: Date, count = 5) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return [now.getFullYear(), now.getFullYear() + 1]
    .flatMap((year) => KEY_DATES.map((d) => ({ ...d, at: new Date(year, d.month - 1, d.day) })))
    .filter((d) => d.at >= today)
    .map((d) => ({ ...d, days: Math.round((d.at.getTime() - today.getTime()) / 86_400_000) }))
    .slice(0, count);
}

export const longDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export function nextKeyDate(now: Date) {
  const d = upcomingKeyDates(now, 1)[0];
  return { title: d.title, days: d.days, date: longDate(d.at), detail: d.detail };
}

export type Audience = "everyone" | "self-assessment" | "employees" | "employers" | "mtd";

/** The fuller calendar for the key dates page and calendar feed. The home page timeline keeps the app's five. */
export const ALL_KEY_DATES: { month: number; day: number; title: string; detail: string; who: Audience; slug: string }[] = [
  { month: 1, day: 31, slug: "self-assessment-deadline", who: "self-assessment", title: "Self Assessment deadline", detail: "File your online return for the last tax year, pay the balance you owe, and make your first payment on account for this year." },
  { month: 2, day: 7, slug: "mtd-q3", who: "mtd", title: "Making Tax Digital quarterly update", detail: "Send the update for 6 October to 5 January, if you're in Making Tax Digital for Income Tax." },
  { month: 4, day: 5, slug: "tax-year-ends", who: "everyone", title: "Tax year ends", detail: "Last day to use this year's ISA allowance, pension annual allowance, Capital Gains Tax exemption and Marriage Allowance." },
  { month: 4, day: 6, slug: "tax-year-starts", who: "everyone", title: "New tax year starts", detail: "New rates and allowances apply. A good day to check your tax code." },
  { month: 5, day: 7, slug: "mtd-q4", who: "mtd", title: "Making Tax Digital quarterly update", detail: "Send the update for 6 January to 5 April." },
  { month: 5, day: 31, slug: "p60", who: "employees", title: "P60 deadline", detail: "Your employer must give you a P60 showing last year's pay and tax." },
  { month: 7, day: 6, slug: "p11d", who: "employers", title: "P11D deadline", detail: "Employers report benefits in kind for last tax year and give employees a copy." },
  { month: 7, day: 31, slug: "second-payment-on-account", who: "self-assessment", title: "Second payment on account", detail: "Pay the second half of your advance payments towards this year's Self Assessment bill." },
  { month: 8, day: 7, slug: "mtd-q1", who: "mtd", title: "Making Tax Digital quarterly update", detail: "Send the update for 6 April to 5 July." },
  { month: 10, day: 5, slug: "register-self-assessment", who: "self-assessment", title: "Register for Self Assessment", detail: "If you started working for yourself, or had new untaxed income, in the last tax year." },
  { month: 10, day: 31, slug: "paper-return", who: "self-assessment", title: "Paper return deadline", detail: "For paper Self Assessment returns. Filing online? You have until 31 January." },
  { month: 11, day: 7, slug: "mtd-q2", who: "mtd", title: "Making Tax Digital quarterly update", detail: "Send the update for 6 July to 5 October." },
  { month: 12, day: 30, slug: "code-out", who: "self-assessment", title: "File online to pay through your tax code", detail: "If you owe less than £3,000 and have PAYE income, filing by today lets HMRC collect it through your tax code." },
];

export const AUDIENCE_LABEL: Record<Audience, string> = {
  everyone: "Everyone",
  "self-assessment": "Self Assessment",
  employees: "Employees",
  employers: "Employers",
  mtd: "Making Tax Digital",
};

/** Making Tax Digital for Income Tax starts in April 2026; its first quarterly update is due 7 August 2026. */
export const MTD_FIRST_UPDATE = new Date(2026, 7, 7);
export const applies = (d: { who: Audience }, at: Date) => d.who !== "mtd" || at >= MTD_FIRST_UPDATE;

/** Every date from `from` (inclusive) for the next `months` months, soonest first. */
export function datesFrom(from: Date, months = 12) {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(start.getFullYear(), start.getMonth() + months, start.getDate());
  return [start.getFullYear(), start.getFullYear() + 1, start.getFullYear() + 2]
    .flatMap((y) => ALL_KEY_DATES.map((d) => ({ ...d, at: new Date(y, d.month - 1, d.day) })))
    .filter((d) => d.at >= start && d.at < end && applies(d, d.at))
    .sort((a, b) => a.at.getTime() - b.at.getTime());
}
