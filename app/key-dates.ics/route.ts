import { ALL_KEY_DATES, AUDIENCE_LABEL, applies } from "@/lib/keyDates";
import { SITE_URL } from "@/lib/site";

/** Rebuilt daily, so the feed always runs from last year to two years ahead. */
export const revalidate = 86400;

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
/** RFC 5545 text: escape, then fold lines at 75 octets (approximated by characters, which is safe for this ASCII-ish text). */
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
const fold = (line: string) => line.length <= 74 ? line : line.match(/.{1,73}/g)!.join("\r\n ");

/** The UK tax calendar as a subscribable iCalendar feed: all-day events with a reminder a week before. */
export function GET() {
  const now = new Date();
  const stamp = `${ymd(now)}T000000Z`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TaxMate//UK tax key dates//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:UK tax dates (TaxMate)",
    "X-WR-CALDESC:HMRC deadlines and key dates for the UK tax year, from TaxMate.",
    "X-WR-TIMEZONE:Europe/London",
    "REFRESH-INTERVAL;VALUE=DURATION:P1W",
    "X-PUBLISHED-TTL:P1W",
  ];
  for (const y of [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1, now.getFullYear() + 2]) {
    for (const d of ALL_KEY_DATES) {
      const at = new Date(y, d.month - 1, d.day), next = new Date(y, d.month - 1, d.day + 1);
      if (!applies(d, at)) continue;
      lines.push(
        "BEGIN:VEVENT",
        `UID:${ymd(at)}-${d.slug}@taxmate-app.com`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${ymd(at)}`,
        `DTEND;VALUE=DATE:${ymd(next)}`,
        fold(`SUMMARY:${esc(d.title)}`),
        fold(`DESCRIPTION:${esc(`${d.detail}\n\nFor: ${AUDIENCE_LABEL[d.who]}. More at ${SITE_URL}/key-dates`)}`),
        `URL:${SITE_URL}/key-dates`,
        "TRANSP:TRANSPARENT",
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        fold(`DESCRIPTION:${esc(`${d.title} in a week`)}`),
        "TRIGGER:-P7D",
        "END:VALARM",
        "END:VEVENT",
      );
    }
  }
  lines.push("END:VCALENDAR");
  return new Response(lines.join("\r\n") + "\r\n", {
    headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": 'inline; filename="taxmate-key-dates.ics"' },
  });
}
