import Link from "next/link";
import { CoinMark } from "./CoinMark";
import { SpinCoins } from "./SpinCoins";
import { appStoreUrl } from "@/lib/site";

const links = [
  { href: "/#tour", label: "Tour" },
  { href: "/calculators", label: "Calculators" },
  { href: "/tax-rates", label: "Tax rates" },
  { href: "/key-dates", label: "Key dates" },
  { href: "/#plus", label: "Plus" },
];

export function Nav() {
  return (
    <header className="site-nav">
      <nav className="site-nav-bar" aria-label="Main">
        <Link href="/" className="mr-auto flex items-center gap-2.5 rounded-full py-1 pr-2" aria-label="TaxMate home">
          <CoinMark className="h-7 w-7" />
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
      </nav>
    </header>
  );
}
