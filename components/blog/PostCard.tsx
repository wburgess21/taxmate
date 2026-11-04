import Link from "next/link";
import { formatDate, type PostCard as Card } from "@/lib/sanity";
import { SanityImg } from "./SanityImg";
import { CoinMark } from "@/components/site/CoinMark";

/** A post card: image on top on wider screens; on phones a compact row with a square thumbnail, so lists stay short. */
export function PostCard({ post, priority = false }: { post: Card; priority?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className="surface-card link-card h-full overflow-hidden !p-0 max-sm:!flex-row max-sm:!gap-0">
      <div className="max-sm:w-[104px] max-sm:flex-none">
        {post.mainImage?.asset ? (
          <SanityImg image={post.mainImage} width={720} ratio={16 / 10} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 104px" className="aspect-[16/10] h-full w-full object-cover max-sm:aspect-square" priority={priority} />
        ) : (
          <div className="green flex aspect-[16/10] h-full w-full items-center justify-center max-sm:aspect-auto max-sm:min-h-[104px]" aria-hidden>
            <CoinMark className="h-16 w-16 text-gold opacity-90 max-sm:h-9 max-sm:w-9" />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-6 max-sm:gap-1.5 max-sm:p-4">
        <p className="text-[0.8125rem] text-muted max-sm:text-[0.75rem]">
          {post.category && <span className="font-medium" style={{ color: "var(--tint)" }}>{post.category.title} · </span>}
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </p>
        <h3 className="text-xl font-light leading-snug tracking-tight max-sm:text-[1.0625rem] max-sm:font-normal">{post.title}</h3>
        <p className="text-[0.9375rem] leading-relaxed text-muted max-sm:line-clamp-2 max-sm:text-[0.875rem]">{post.excerpt}</p>
      </div>
    </Link>
  );
}
