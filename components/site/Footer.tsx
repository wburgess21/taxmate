import Link from "next/link";
import { CoinMark } from "./CoinMark";
import { APP_STORE_URL, CONTACT_EMAIL, TAX_YEAR } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <CoinMark className="h-8 w-8" />
            <span className="text-lg font-medium tracking-tight">TaxMate</span>
          </Link>
          <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-muted">
            Your UK tax, made clearer. Calculators for pay, self-employment, expenses and planning, on iPhone and iPad.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="mt-4 inline-block text-[0.95rem] text-accent underline-offset-4 hover:underline">
            {CONTACT_EMAIL}
          </a>
        </div>
        <div>
          <h3 className="text-sm font-medium">Product</h3>
          <ul className="mt-4 space-y-2.5 text-[0.95rem] text-muted">
            <li><Link className="hover:text-ink" href="/#tools">Tools</Link></li>
            <li><Link className="hover:text-ink" href="/#how-it-works">How it works</Link></li>
            <li><Link className="hover:text-ink" href="/#plus">TaxMate Plus</Link></li>
            <li><Link className="hover:text-ink" href="/#faq">FAQ</Link></li>
            <li><a className="hover:text-ink" href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">App Store ↗</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-medium">Legal</h3>
          <ul className="mt-4 space-y-2.5 text-[0.95rem] text-muted">
            <li><Link className="hover:text-ink" href="/privacy">Privacy policy</Link></li>
            <li><Link className="hover:text-ink" href="/terms">Terms of use</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-hairline">
        <p className="mx-auto max-w-6xl px-4 py-6 text-[0.8125rem] leading-relaxed text-muted sm:px-6">
          © {new Date().getFullYear()} TaxMate. Estimates use {TAX_YEAR} HMRC rates and are for planning only, not tax advice.
          TaxMate is independent and not affiliated with HMRC.
        </p>
      </div>
    </footer>
  );
}
