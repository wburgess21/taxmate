import { llmsFullTxt } from "@/lib/llms";
import { getPostIndex } from "@/lib/sanity";

/** Rebuilt hourly (and on publish) so new posts are listed. */
export const revalidate = 3600;

export async function GET() {
  const posts = (await getPostIndex()).filter((p) => !p.noindex);
  return new Response(llmsFullTxt(posts), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
