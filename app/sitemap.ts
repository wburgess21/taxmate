import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { CALCULATORS } from "@/lib/calculators";
import { AUDIENCES } from "@/lib/audiences";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/calculators`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/tax-rates`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/key-dates`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/for`, changeFrequency: "monthly", priority: 0.6 },
    ...AUDIENCES.map((a) => ({ url: `${SITE_URL}/for/${a.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...CALCULATORS.map((c) => ({ url: `${SITE_URL}/calculators/${c.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
