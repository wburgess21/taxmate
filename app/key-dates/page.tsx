import type { Metadata } from "next";
import { CalendarPlus, Download } from "lucide-react";
import { datesFrom } from "@/lib/keyDates";
import { KeyDatesList } from "@/components/site/KeyDatesList";
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
        <KeyDatesList dates={dates.map((d) => ({ key: `${d.slug}-${d.at.getFullYear()}`, iso: `${d.at.getFullYear()}-${String(d.at.getMonth() + 1).padStart(2, "0")}-${String(d.at.getDate()).padStart(2, "0")}`, title: d.title, detail: d.detail, who: d.who, days: d.days }))} />

        <aside className="max-lg:order-first lg:sticky lg:top-28 lg:self-start">
          <div className="surface-card p-5 sm:p-8">
            {next && (
              <div className="flex items-end justify-between gap-4 lg:block">
                <div>
                  <p className="kicker">Next up</p>
                  <p className="mt-2 font-medium lg:mt-3">{next.title}</p>
                  <p className="mt-0.5 text-[0.875rem] text-muted">{next.at.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</p>
                </div>
                <p className="result-figure flex-none !text-[2.5rem] lg:mt-4 lg:!text-[3.5rem]">{next.days === 0 ? "Today" : `${next.days} day${next.days === 1 ? "" : "s"}`}</p>
              </div>
            )}
            <div className="mt-5 grid grid-cols-2 gap-2.5 lg:mt-7 lg:grid-cols-1 lg:gap-3">
              <a href={FEED} className="btn-primary press col-span-2 lg:col-span-1" data-cta="key-dates-subscribe-apple"><CalendarPlus className="h-4 w-4" aria-hidden /> Add to Apple Calendar</a>
              <a href={GOOGLE} target="_blank" rel="noopener noreferrer" className="btn-ghost press !px-3 !text-[0.9375rem]" data-cta="key-dates-subscribe-google">Google Calendar</a>
              <a href="/key-dates.ics" download className="btn-ghost press !px-3 !text-[0.9375rem]" data-cta="key-dates-download"><Download className="h-4 w-4" aria-hidden /> .ics file</a>
            </div>
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted">A subscription, with a reminder a week before each date. New years appear on their own, with no account or email. <span className="max-lg:hidden">For Outlook, subscribe from the web using <span className="break-all font-mono text-[0.75rem]">{SITE_URL}/key-dates.ics</span>.</span></p>
          </div>
        </aside>
      </div>

      <AppCta title={["Only the dates", "that apply to you."]} body="The TaxMate home screen counts down to your next HMRC date, based on how you work, and reminds you a week before and on the day. Reminders are scheduled on your iPhone." placement="key-dates" />
    </InnerPage>
  );
}
