import Link from "next/link";
import { CoinMark } from "./CoinMark";
import { AppStoreButton } from "./AppStoreButton";

const links = [
  { href: "/#tools", label: "Tools" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#plus", label: "Plus" },
  { href: "/#faq", label: "FAQ" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50">
      <div className="glass-light border-x-0 border-t-0">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Main">
          <Link href="/" className="group flex items-center gap-2.5 rounded-lg" aria-label="TaxMate home">
            <CoinMark className="h-8 w-8 text-ink transition-transform group-hover:[animation:coin-wobble_0.7s_ease-in-out]" />
            <span className="text-lg font-medium tracking-tight">TaxMate</span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-full px-3.5 py-2 text-[0.95rem] text-muted transition-colors hover:bg-hairline hover:text-ink">
                {l.label}
              </Link>
            ))}
          </div>
          <AppStoreButton label="Get the app" className="!min-h-10 !rounded-full !px-4 !text-[0.95rem]" />
        </nav>
      </div>
    </header>
  );
}
