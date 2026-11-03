import { llmsTxt } from "@/lib/llms";
import { CALCULATORS } from "@/lib/calculators";
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
      title: "Reference",
      links: [
        { title: `UK tax rates and thresholds ${TAX_YEAR}`, url: `${SITE_URL}/tax-rates`, note: "Income Tax (including Scotland), National Insurance, allowances, dividends, Capital Gains Tax, student loans, VAT, mileage, Corporation Tax and Making Tax Digital" },
      ],
    },
  ]);
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
