import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Everything public is open to search engines and AI crawlers alike: being quoted by assistants is part of the point.
 * Only the webhook endpoint is kept out. Agents should start at /llms.txt.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
