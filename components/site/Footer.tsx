import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CoinMark } from "./CoinMark";
import { APP_STORE_URL, CONTACT_EMAIL, TAX_YEAR } from "@/lib/site";

const COLUMNS = [
  { title: "Explore", links: [["/#tour", "The tour"], ["/#pay", "Your pay, in coins"], ["/#tools", "Tools"], ["/#dates", "Key dates"], ["/#plus", "TaxMate Plus"], ["/#faq", "Questions"]] },
  { title: "Legal", links: [["/privacy", "Privacy policy"], ["/terms", "Terms of use"]] },
];

export function Footer() {
  return (
    <footer className="mx-auto max-w-[1240px] px-5 pb-10 pt-20 sm:px-8">
      <div className="grid gap-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3" aria-label="TaxMate home">
            <CoinMark className="h-10 w-10" />
            <span className="text-2xl font-light tracking-tight">TaxMate</span>
          </Link>
          <p className="mt-5 max-w-sm leading-relaxed text-muted">
            Your UK tax, made clearer. Calculators for pay, self-employment, expenses and planning, on iPhone and iPad.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
            <a href={APP_STORE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-accent underline-offset-4 hover:underline">Download on the App Store <ArrowUpRight className="h-4 w-4" aria-hidden /></a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-muted underline-offset-4 hover:text-ink hover:underline">{CONTACT_EMAIL}</a>
          </div>
        </div>
        {COLUMNS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h3 className="kicker">{c.title}</h3>
            <ul className="mt-5 grid gap-3 text-[0.9375rem]">
              {c.links.map(([href, label]) => (
                <li key={href}><Link href={href} className="text-muted transition-colors hover:text-ink">{label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      {/* On phones the independence note sits above the rule, apart from the copyright line. */}
      <p className="mt-14 text-[0.8125rem] leading-relaxed text-muted md:hidden">TaxMate is independent and not affiliated with HMRC.</p>
      <p className="mt-6 border-t border-hairline pt-6 text-[0.8125rem] leading-relaxed text-muted md:mt-16">
        © {new Date().getFullYear()} TaxMate. Estimates use {TAX_YEAR} HMRC rates and are for planning only, not tax advice.<span className="hidden md:inline"> TaxMate is independent and not affiliated with HMRC.</span>
      </p>
    </footer>
  );
}
