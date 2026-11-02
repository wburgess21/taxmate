import { ArrowUpRight, FileText } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const metadata = {
  title: "Terms of Use",
  description: "Terms of use for TaxMate, the UK tax calculator app for iPhone and iPad.",
  alternates: { canonical: "/terms" },
};

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_700px_at_0%_0%,var(--glow),transparent_70%)]">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-36 sm:px-6 sm:pb-28 sm:pt-44">
        <div className="surface-card p-8 text-center sm:p-12" style={{ ["--tint" as string]: "var(--tool-planning)" }}>
          <span className="tool-badge mx-auto"><FileText className="h-5 w-5" aria-hidden /></span>
          <h1 className="mt-6 text-4xl font-light tracking-tight sm:text-5xl">Terms of Use</h1>
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted">
            We use Apple&rsquo;s standard terms of use. You can find out more here:
          </p>
          <a
            href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary press mt-8"
          >
            Apple&rsquo;s Standard EULA <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
