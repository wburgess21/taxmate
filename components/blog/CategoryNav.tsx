import Link from "next/link";
import type { Category } from "@/lib/sanity";

/** Category chips: one row that scrolls sideways on phones. */
export function CategoryNav({ categories, current }: { categories: Category[]; current?: string }) {
  if (!categories.length) return null;
  const items: [string, string, boolean][] = [["/blog", "All", !current], ...categories.map((c) => [`/blog/category/${c.slug}`, c.title, current === c.slug] as [string, string, boolean])];
  return (
    <nav aria-label="Categories" className="mx-auto mt-8 max-w-[1240px] px-5 sm:mt-10 sm:px-8">
      <ul className="chip-row">
        {items.map(([href, label, on]) => (
          <li key={href} className="flex-none"><Link href={href} className="check" aria-current={on ? "page" : undefined} data-active={on || undefined}>{label}</Link></li>
        ))}
      </ul>
    </nav>
  );
}
