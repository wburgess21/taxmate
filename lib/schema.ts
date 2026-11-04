import { APP_STORE_ID, APP_STORE_URL, CONTACT_EMAIL, SITE_URL } from "./site";
import { TOOLS } from "./tools";

/** schema.org builders. Everything is linked by `@id`, so a page's graph can point at the app and the organisation. */
export const ORG_ID = `${SITE_URL}/#organization`;
export const APP_ID = `${SITE_URL}/#app`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const APP_DESCRIPTION =
  "UK tax calculators for iPhone and iPad: take-home pay, self-employed tax, combined income, home office, business expenses, mileage, pensions, tax savings, VAT, Making Tax Digital and annual summaries. Free estimates, with a one-time TaxMate Plus purchase and no subscription. Calculations stay on your device.";

export type Rating = { value: number; count: number };

/** The site-wide graph: who makes TaxMate, the website, and the app itself. */
export function siteSchema(rating?: Rating | null) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORG_ID,
        name: "TaxMate",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        email: CONTACT_EMAIL,
        sameAs: [APP_STORE_URL],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: "TaxMate",
        url: SITE_URL,
        inLanguage: "en-GB",
        publisher: { "@id": ORG_ID },
      },
      {
        "@type": "MobileApplication",
        "@id": APP_ID,
        name: "TaxMate",
        alternateName: "TaxMate: Home Office Tax",
        description: APP_DESCRIPTION,
        url: SITE_URL,
        installUrl: APP_STORE_URL,
        downloadUrl: APP_STORE_URL,
        identifier: `id${APP_STORE_ID}`,
        operatingSystem: "iOS, iPadOS",
        applicationCategory: "FinanceApplication",
        inLanguage: "en-GB",
        countriesSupported: "GB",
        image: `${SITE_URL}/logo.png`,
        featureList: TOOLS.map((t) => `${t.title}: ${t.benefit}`),
        publisher: { "@id": ORG_ID },
        offers: [
          { "@type": "Offer", name: "TaxMate", price: "0", priceCurrency: "GBP", availability: "https://schema.org/InStock", url: APP_STORE_URL },
        ],
        ...(rating ? { aggregateRating: { "@type": "AggregateRating", ratingValue: rating.value.toFixed(1), ratingCount: rating.count, bestRating: "5", worstRating: "1" } } : {}),
      },
    ],
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

/** Breadcrumbs from the home page down, e.g. [["Calculators", "/calculators"], ["Take-home pay", "/calculators/take-home-pay"]]. */
export function breadcrumbSchema(trail: [name: string, path: string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [["Home", "/"] as const, ...trail].map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${SITE_URL}${path === "/" ? "" : path}` })),
  };
}
