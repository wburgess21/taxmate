import Link from "next/link";
import { SpinCoins } from "./SpinCoins";
import { MobileMenu } from "./MobileMenu";
import { appStoreUrl } from "@/lib/site";
import { AUDIENCES } from "@/lib/audiences";

const links = [
  { href: "/calculators", label: "Calculators" },
  { href: "/tax-rates", label: "Tax rates" },
  { href: "/key-dates", label: "Key dates" },
  { href: "/blog", label: "Blog" },
  { href: "/#plus", label: "Plus" },
];

/** Shown only in the phone menu, under the main links. */
const extra = [
  { href: "/#tour", label: "The tour" },
  { href: "/#faq", label: "Questions" },
  { href: "/privacy", label: "Privacy" },
];

const guides = AUDIENCES.map((a) => ({ href: `/for/${a.slug}`, label: a.label }));

export function Nav() {
  return (
    <header className="site-nav">
      <nav className="site-nav-bar" aria-label="Main">
        <Link href="/" className="mr-auto flex items-center gap-2.5 rounded-full py-1 pr-2" aria-label="TaxMate home">
          {/* Hovering the logo plays the same spin as the Get the app button, in the header's own colour. */}
          <SpinCoins className="h-7 w-7" ink="current" delay={0} />
          <span className="text-[1.0625rem] font-medium tracking-tight">TaxMate</span>
        </Link>
        <div className="hidden items-center md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">{l.label}</Link>
          ))}
        </div>
        <a href={appStoreUrl("nav")} data-cta="nav" target="_blank" rel="noopener noreferrer" className="btn-primary nav-cta ml-2 !min-h-10 !px-4 !text-[0.9375rem]">
          {/* On hover the button widens and the hero's coins slide in, playing the home logo's spin as they arrive. */}
          <span className="nav-cta-coin" aria-hidden><SpinCoins className="h-[1.15em] w-[1.15em]" /></span>
          Get the app
        </a>
        <MobileMenu links={links} extra={extra} guides={guides} />
      </nav>
    </header>
  );
}
