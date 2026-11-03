import { CALCULATORS, type CalculatorPage } from "./calculators";
import { APP_ID, ORG_ID, WEBSITE_ID } from "./schema";
import { SITE_URL } from "./site";

export const calcUrl = (slug: string) => `${SITE_URL}/calculators/${slug}`;

/** A calculator page as a free WebApplication, linked to the app it previews. */
export function calculatorSchema(c: CalculatorPage) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${calcUrl(c.slug)}#calculator`,
    name: `${c.name} calculator`,
    headline: c.title,
    description: c.description,
    url: calcUrl(c.slug),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    inLanguage: "en-GB",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    isRelatedTo: { "@id": APP_ID },
  };
}

export function calculatorListSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "UK tax calculators",
    itemListElement: CALCULATORS.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: calcUrl(c.slug), name: `${c.name} calculator` })),
  };
}
