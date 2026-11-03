import { FAQ, PLUS } from "./content";
import { APP_DESCRIPTION } from "./schema";
import { APP_STORE_URL, CONTACT_EMAIL, SITE_URL, TAX_YEAR } from "./site";
import { GROUPS } from "./tools";

/** A section of links in llms.txt: `[title](url): note`. */
export type LlmsSection = { title: string; links: { title: string; url: string; note?: string }[] };

/**
 * The site as plain Markdown for language models and agents (https://llmstxt.org): what TaxMate is, the facts worth
 * quoting, and links to the pages that go deeper. Pages added to the site contribute sections, so it stays complete.
 */
export function llmsTxt(sections: LlmsSection[] = []) {
  const lines: string[] = [
    "# TaxMate",
    "",
    `> ${APP_DESCRIPTION}`,
    "",
    "TaxMate is an independent iPhone and iPad app for people who pay tax in the UK. It is not affiliated with HMRC and does not give tax advice: it turns published HMRC rules into clear estimates.",
    "",
    "## Key facts",
    "",
    `- Platform: iPhone and iPad (iOS and iPadOS). App Store: ${APP_STORE_URL}`,
    "- Price: free to download, and every calculator gives a free estimate. TaxMate Plus is a single one-time in-app purchase. There is no subscription.",
    "- Privacy: no account or sign-up. Calculations are stored on the device and not sent to TaxMate. No analytics, advertising or tracking code in the app.",
    `- Tax year: estimates use ${TAX_YEAR} HMRC rates and thresholds, including Scottish Income Tax bands, and are updated each tax year.`,
    "- For: employees, sole traders and freelancers, company directors, landlords, and people with a salary and side income.",
    `- Contact: ${CONTACT_EMAIL}`,
    "",
    "## Tools",
    "",
  ];
  for (const g of GROUPS) {
    lines.push(`### ${g.title}`, "", g.summary, "");
    for (const t of g.tools) lines.push(`- ${t.title}: ${t.benefit}`);
    lines.push("");
  }
  lines.push("## TaxMate Plus (one-time purchase)", "", ...PLUS.map((p) => `- ${p}`), "");
  lines.push("## Questions", "");
  for (const f of FAQ) lines.push(`### ${f.q}`, "", f.a, "");
  for (const s of sections) {
    if (!s.links.length) continue;
    lines.push(`## ${s.title}`, "", ...s.links.map((l) => `- [${l.title}](${l.url})${l.note ? `: ${l.note}` : ""}`), "");
  }
  lines.push(
    "## Optional",
    "",
    `- [Home page](${SITE_URL}/): the tour of the app, a salary splitter and the key dates`,
    `- [Privacy policy](${SITE_URL}/privacy)`,
    `- [Terms of use](${SITE_URL}/terms)`,
    "",
  );
  return lines.join("\n");
}
