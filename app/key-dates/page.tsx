import type { Metadata } from "next";
import { CalendarPlus, Download } from "lucide-react";
import { AUDIENCE_LABEL, datesFrom } from "@/lib/keyDates";
import { SITE_URL, TAX_YEAR } from "@/lib/site";
import { InnerPage, PageHeading } from "@/components/site/InnerPage";
import { AppCta } from "@/components/site/AppCta";

/** Rebuilt daily so the countdown and the year ahead stay current. */
export const revalidate = 86400;

const title = `HMRC Key Dates and Tax Deadlines ${TAX_YEAR}`;
const description = "Every UK tax deadline for the year ahead: Self Assessment, payments on account, registering, P60s and P11Ds, the end of the tax year and Making Tax Digital quarterly updates. Add them to your calendar for free.";

export const metadata: Metadata = {
  title: { absolute: `${title} · TaxMate` },
  description,
  alternates: { canonical: "/key-dates" },
  openGraph: { title, description, url: "/key-dates" },
};

const FEED = `${SITE_URL.replace(/^https?:/, "webcal:")}/key-dates.ics`;
const GOOGLE = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(FEED)}`;

const TINTS: Record<string, string> = {
  everyone: "var(--tool-income)",
  "self-assessment": "var(--tool-claims)",
  employees: "var(--tool-income)",
  employers: "var(--pay-pension)",
  mtd: "var(--tool-planning)",
};

export default function KeyDates() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dates = datesFrom(today, 12).map((d) => ({ ...d, days: Math.round((d.at.getTime() - today.getTime()) / 86_400_000) }));
  const months = new Map<string, typeof dates>();
  for (const d of dates) {
    const k = d.at.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    months.set(k, [...(months.get(k) ?? []), d]);
  }
  const next = dates[0];

  return (
    <InnerPage tint="var(--tool-planning)" crumbs={[["Key dates", "/key-dates"]]}>
      <PageHeading kicker="The next 12 months" h1={["Tax deadlines,", "in your calendar."]} lede="Every HMRC date that matters for the year ahead. Subscribe once and they appear in your calendar, with a reminder a week before, and roll on to next year by themselves." />

      <div className="mx-auto mt-12 grid max-w-[1240px] grid-cols-[minmax(0,1fr)] gap-6 px-5 sm:px-8 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
        <div className="min-w-0">
          {[...months].map(([month, items]) => (
            <section key={month} aria-labelledby={`m-${month}`} className="mb-12 last:mb-0">
              <h2 id={`m-${month}`} className="kicker">{month}</h2>
              <ul className="mt-4 grid gap-3">
                {items.map((d) => (
                  <li key={`${d.slug}-${d.at.getFullYear()}`} className="surface-card flex gap-5 p-5 sm:gap-6 sm:p-6" style={{ ["--tint" as string]: TINTS[d.who] }}>
                    <div className="flex w-14 flex-none flex-col items-center justify-center rounded-2xl py-2.5 text-center" style={{ background: "color-mix(in srgb, var(--tint) 13%, transparent)", color: "var(--tint)" }}>
                      <span className="text-2xl font-light leading-none tabular-nums">{d.at.getDate()}</span>
                      <span className="mt-1 text-[0.6875rem] font-medium uppercase tracking-[0.08em]">{d.at.toLocaleDateString("en-GB", { month: "short" })}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[1.0625rem] font-medium leading-snug">{d.title}</h3>
                      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-muted">{d.detail}</p>
                      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-muted">
                        <span className="font-medium" style={{ color: "var(--tint)" }}>{AUDIENCE_LABEL[d.who]}</span>
                        <span aria-hidden>·</span>
                        <span>{d.days === 0 ? "Today" : d.days === 1 ? "Tomorrow" : `In ${d.days} days`}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <aside className="max-lg:order-first lg:sticky lg:top-28 lg:self-start">
          <div className="surface-card p-6 sm:p-8">
            {next && (
              <>
                <p className="kicker">Next up</p>
                <p className="result-figure mt-3 !text-[3.5rem]">{next.days === 0 ? "Today" : `${next.days} day${next.days === 1 ? "" : "s"}`}</p>
                <p className="mt-3 font-medium">{next.title}</p>
                <p className="mt-1 text-[0.9375rem] text-muted">{next.at.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
              </>
            )}
            <div className="mt-7 grid gap-3">
              <a href={FEED} className="btn-primary press" data-cta="key-dates-subscribe-apple"><CalendarPlus className="h-4 w-4" aria-hidden /> Add to Apple Calendar</a>
              <a href={GOOGLE} target="_blank" rel="noopener noreferrer" className="btn-ghost press" data-cta="key-dates-subscribe-google">Add to Google Calendar</a>
              <a href="/key-dates.ics" download className="btn-ghost press" data-cta="key-dates-download"><Download className="h-4 w-4" aria-hidden /> Download .ics</a>
            </div>
            <p className="mt-5 text-[0.8125rem] leading-relaxed text-muted">A calendar subscription, so new years appear on their own. No email address or account needed. Outlook: add from the web with <span className="break-all font-mono text-[0.75rem]">{SITE_URL}/key-dates.ics</span>.</p>
          </div>
        </aside>
      </div>

      <AppCta title={["Only the dates", "that apply to you."]} body="The TaxMate home screen counts down to your next HMRC date, based on how you work, and reminds you a week before and on the day. Reminders are scheduled on your iPhone." placement="key-dates" />
    </InnerPage>
  );
}
