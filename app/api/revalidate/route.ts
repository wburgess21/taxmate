import { revalidatePath, revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { SANITY_TAG } from "@/lib/sanity";

/**
 * Sanity's publish webhook calls this so new and edited posts go live straight away instead of within the hour.
 * Set SANITY_REVALIDATE_SECRET in Vercel and send it as `Authorization: Bearer <secret>` from the webhook.
 */
export async function POST(req: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const given = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const ok = !!secret && given.length === secret.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!ok) return Response.json({ revalidated: false }, { status: 401 });
  // Expire at once: the webhook means the content has changed.
  revalidateTag(SANITY_TAG, { expire: 0 });
  for (const path of ["/blog", "/sitemap.xml", "/llms.txt", "/blog/rss.xml"]) revalidatePath(path);
  return Response.json({ revalidated: true, at: new Date().toISOString() });
}
