export const SITE_URL = "https://www.taxmate-app.com";
export const APP_STORE_ID = "6757307991";
export const APP_STORE_URL = `https://apps.apple.com/gb/app/taxmate-home-office-tax/id${APP_STORE_ID}`;
export const CONTACT_EMAIL = "taxmateapp@outlook.com";
export const TAX_YEAR = "2026/27";

/**
 * Apple's provider token (App Store Connect → Analytics → Sources → Campaigns). With it, the `ct` campaign on each link
 * shows up as a source in App Store Connect, so installs can be traced back to the page and button that sent them.
 */
const PROVIDER_TOKEN = process.env.NEXT_PUBLIC_APP_STORE_PROVIDER_TOKEN;

/** The App Store link tagged with a campaign, e.g. `home-hero` or `calc-take-home-pay` (Apple allows 40 characters). */
export function appStoreUrl(campaign?: string) {
  if (!campaign) return APP_STORE_URL;
  const q = new URLSearchParams();
  if (PROVIDER_TOKEN) q.set("pt", PROVIDER_TOKEN);
  q.set("ct", campaign.slice(0, 40));
  q.set("mt", "8");
  return `${APP_STORE_URL}?${q}`;
}
