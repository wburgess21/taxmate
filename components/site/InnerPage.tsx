import type { ReactNode } from "react";
import Link from "next/link";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { JsonLd } from "./JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

/** The frame for every page below the home page: nav, a soft tinted glow, breadcrumbs and the footer. */
export function InnerPage({ tint = "var(--tool-income)", crumbs, children }: { tint?: string; crumbs: [string, string][]; children: ReactNode }) {
  return (
    <div className="page-glow min-h-screen" style={{ ["--tint" as string]: tint }}>
      <JsonLd data={breadcrumbSchema(crumbs)} />
      <Nav />
      <main className="pb-6">
        <div className="mx-auto max-w-[1240px] px-5 pt-28 sm:px-8 sm:pt-36">
          <nav aria-label="Breadcrumb">
            <ol className="crumbs">
              <li><Link href="/">Home</Link></li>
              {crumbs.map(([name, href], i) => (
                i === crumbs.length - 1
                  // The current page can be a long post title: one line, cut short with an ellipsis.
                  ? <li key={href} className="flex min-w-0 max-w-full"><span aria-current="page" className="truncate text-ink">{name}</span></li>
                  : <li key={href}><Link href={href}>{name}</Link></li>
              ))}
            </ol>
          </nav>
        </div>
        {children}
      </main>
      <Footer />
    </div>
  );
}

/** A page's headline block: kicker, display heading (second half in the serif) and a lede. */
export function PageHeading({ kicker, h1, lede, children }: { kicker: ReactNode; h1: [string, string]; lede: string; children?: ReactNode }) {
  return (
    <header className="mx-auto max-w-[1240px] px-5 pt-8 sm:px-8 sm:pt-10">
      <p className="kicker flex items-center gap-2.5"><span className="h-2 w-2 rounded-full" style={{ background: "var(--tint)" }} aria-hidden />{kicker}</p>
      <h1 className="display mt-5 max-w-4xl text-[2.75rem] sm:text-6xl lg:text-[4.75rem]">{h1[0]} <em>{h1[1]}</em></h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{lede}</p>
      {children}
    </header>
  );
}

/** A section heading inside an inner page. */
export function SectionHeading({ kicker, children }: { kicker?: string; children: ReactNode }) {
  return (
    <div className="max-w-3xl">
      {kicker && <p className="kicker">{kicker}</p>}
      <h2 className="display mt-4 text-[2.25rem] sm:text-5xl">{children}</h2>
    </div>
  );
}
