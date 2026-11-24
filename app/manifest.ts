import type { MetadataRoute } from "next";
import { APP_STORE_ID } from "@/lib/site";

/** For browsers and "Add to Home Screen": the name, icons and colours, and a pointer to the real app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TaxMate: UK tax calculators",
    short_name: "TaxMate",
    description: "Free UK tax calculators, 2026/27 rates and HMRC key dates, from the TaxMate app for iPhone and iPad.",
    start_url: "/",
    scope: "/",
    display: "browser",
    lang: "en-GB",
    categories: ["finance", "productivity", "utilities"],
    background_color: "#f4f3ee",
    theme_color: "#005424",
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/logo.png", type: "image/png", sizes: "1024x1024", purpose: "any" },
    ],
    related_applications: [{ platform: "itunes", url: `https://apps.apple.com/gb/app/id${APP_STORE_ID}`, id: APP_STORE_ID }],
    prefer_related_applications: false,
    shortcuts: [
      { name: "Take-home pay calculator", url: "/calculators/take-home-pay" },
      { name: "Tax rates 2026/27", url: "/tax-rates" },
      { name: "HMRC key dates", url: "/key-dates" },
    ],
  };
}
