import Link from "next/link";
import { CoinMark } from "./CoinMark";
import { APP_STORE_URL } from "@/lib/site";

const links = [
  { href: "/#tour", label: "Tour" },
  { href: "/#pay", label: "Your pay" },
  { href: "/#tools", label: "Tools" },
  { href: "/#plus", label: "Plus" },
  { href: "/#faq", label: "FAQ" },
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
        <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="btn-primary nav-cta ml-2 !min-h-10 !px-4 !text-[0.9375rem]">
          Get the app
        </a>
      </nav>
    </header>
  );
}
