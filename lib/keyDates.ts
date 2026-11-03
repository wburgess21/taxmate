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
