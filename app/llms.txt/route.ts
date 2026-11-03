import { llmsTxt } from "@/lib/llms";
import { CALCULATORS } from "@/lib/calculators";
import { AUDIENCES } from "@/lib/audiences";
import { calcUrl } from "@/lib/calcSchema";
import { SITE_URL, TAX_YEAR } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const body = llmsTxt([
    {
      title: "Free web calculators",
      links: [
        { title: "All calculators", url: `${SITE_URL}/calculators` },
        ...CALCULATORS.map((c) => ({ title: `${c.name} calculator`, url: calcUrl(c.slug), note: c.description })),
      ],
    },
    {
      title: "Guides by situation",
      links: AUDIENCES.map((a) => ({ title: a.title, url: `${SITE_URL}/for/${a.slug}`, note: a.description })),
    },
    {
      title: "Reference",
      links: [
        { title: `UK tax rates and thresholds ${TAX_YEAR}`, url: `${SITE_URL}/tax-rates`, note: "Income Tax (including Scotland), National Insurance, allowances, dividends, Capital Gains Tax, student loans, VAT, mileage, Corporation Tax and Making Tax Digital" },
        { title: "HMRC key dates", url: `${SITE_URL}/key-dates`, note: "Every UK tax deadline for the next 12 months" },
        { title: "Key dates calendar feed (iCalendar)", url: `${SITE_URL}/key-dates.ics` },
      ],
    },
  ]);
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
