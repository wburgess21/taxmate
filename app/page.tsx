import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Banknote,
  BarChart3,
  Bell,
  Briefcase,
  CalendarClock,
  Car,
  Check,
  ChevronRight,
  CreditCard,
  FileText,
  Home as HomeIcon,
  Layers,
  LayoutDashboard,
  Lock,
  Percent,
  PiggyBank,
  Share2,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Star,
  Tablet,
  TrendingUp,
  Wand2,
} from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { AppStoreButton } from "@/components/site/AppStoreButton";
import { HeroCoins } from "@/components/coins/HeroCoins";
import { CoinStack } from "@/components/coins/CoinStack";
import { CoinField } from "@/components/coins/CoinField";
import { TakeHomeDemo } from "@/components/TakeHomeDemo";
import { KeyDateCard } from "@/components/KeyDateCard";
import { TAX_YEAR } from "@/lib/site";

type Tool = { title: string; benefit: string; icon: LucideIcon };
type Group = { id: string; title: string; summary: string; tint: string; icon: LucideIcon; tools: Tool[] };

/** The app's tool groups and their tints (CalculatorCatalogView.swift). */
const GROUPS: Group[] = [
  {
    id: "income",
    title: "Your income",
    summary: "See what you take home and what you owe.",
    tint: "var(--tool-income)",
    icon: Banknote,
    tools: [
      { title: "Take Home Pay", benefit: "Understand your pay after deductions", icon: Banknote },
      { title: "Self-employed Tax", benefit: "Understand your annual business tax", icon: Briefcase },
      { title: "Combined Income", benefit: "Plan supported employment and business income", icon: Layers },
    ],
  },
  {
    id: "claims",
    title: "Claim and reduce",
    summary: "Lower your bill with allowable costs and relief.",
    tint: "var(--tool-claims)",
    icon: TrendingUp,
    tools: [
      { title: "Home Office", benefit: "Estimate your home office tax relief", icon: HomeIcon },
      { title: "Business Expenses", benefit: "Compare costs and allowances", icon: CreditCard },
      { title: "Business Mileage", benefit: "Estimate deductions and keep journey logs", icon: Car },
      { title: "Pension Contribution", benefit: "Compare cash and pension tax relief", icon: PiggyBank },
    ],
  },
  {
    id: "planning",
    title: "Plan ahead",
    summary: "Stay ahead of payments, thresholds and dates.",
    tint: "var(--tool-planning)",
    icon: CalendarClock,
    tools: [
      { title: "Tax Savings Planner", benefit: "Set money aside for dated tax payments", icon: CalendarClock },
      { title: "VAT", benefit: "Add or remove VAT and monitor turnover", icon: Percent },
      { title: "Making Tax Digital", benefit: "Check eligibility and start dates", icon: Smartphone },
      { title: "Annual Summary", benefit: "Share planning records as PDF or CSV", icon: FileText },
    ],
  },
];

const STEPS = [
  { face: "?", title: "Tell TaxMate about you", body: "A few quick questions: your situation, region, income and goals. One question per screen, and “Prefer not to say” is always an option." },
  { face: "%", title: "See your tax picture", body: "Your next key dates, your Making Tax Digital status and the tools that fit you, picked from your answers." },
  { face: "£", title: "Get a live estimate", body: "Every calculator leads with the answer and updates as you type. Smart fill reuses figures you’ve already entered elsewhere." },
  { face: "✓", title: "Save, compare and share", body: "Keep results on your device, try “What if?” changes side by side, and export an annual summary for your accountant." },
];
const STEP_FACES = STEPS.map((s) => s.face);

const FEATURES: { title: string; body: string; icon: LucideIcon; tint: string }[] = [
  { title: "Smart fill", body: "Salary or business figures you’ve entered once fill the next calculator in a tap, with Undo if you change your mind.", icon: Wand2, tint: "var(--tool-income)" },
  { title: "What if?", body: "Try a pay rise, a bigger pension or a new expense and see exactly what changes before you commit.", icon: SlidersHorizontal, tint: "var(--tool-claims)" },
  { title: "Your tax overview", body: "One page for your latest estimate, what’s due and when, and how much you’ve set aside towards it.", icon: LayoutDashboard, tint: "var(--tool-planning)" },
  { title: "Deadline reminders", body: "Free, opt-in reminders before the HMRC dates that apply to you. They’re scheduled on your device.", icon: Bell, tint: "var(--tool-income)" },
  { title: "Share your payday", body: "Turn a take-home estimate into a tidy card to share, or keep a clear history of every result.", icon: Share2, tint: "var(--pay-pension)" },
  { title: "Made for iPad too", body: "On iPad the live estimate stays beside your inputs, so the answer is always in view.", icon: Tablet, tint: "var(--tool-planning)" },
];

const PLUS = [
  "Home Office reports",
  "Saved tax savings plans",
  "Manual journey logs",
  "Named expense comparisons",
  "Annual PDF / CSV summaries",
  "Pension comparisons",
  "Combined-income planning",
  "Rolling VAT monitoring",
  "Plan and VAT reminders",
];

const FAQ = [
  { q: "Is TaxMate free?", a: "Yes, it’s free to download, and every calculator gives you a free estimate. TaxMate Plus is a single, one-time purchase that unlocks saved reports, plans, journey logs, exports and monitoring. There’s no subscription." },
  { q: "Where are my answers and calculations stored?", a: "On your device. There’s no account to create, and your calculations aren’t sent to us. Deadline reminders are scheduled locally on your iPhone or iPad." },
  { q: "Which tax year does it use?", a: `Estimates use ${TAX_YEAR} HMRC rates and thresholds, including Scottish income tax bands. The rules are checked against GOV.UK guidance and updated for each new tax year.` },
  { q: "Who is TaxMate for?", a: "Employees checking their pay, sole traders and freelancers, landlords, and anyone with both a salary and side income. Answer a few questions and TaxMate highlights the tools that fit you." },
  { q: "Is this tax advice? Is TaxMate affiliated with HMRC?", a: "No to both. TaxMate is an independent planning tool built on published HMRC guidance. Estimates depend on the figures you enter, so keep your records and check anything important with HMRC or an accountant." },
  { q: "Can I share results with my accountant?", a: "Yes. Results can be shared, and with Plus the Annual Summary exports your selected planning records as a PDF or CSV." },
];

function SectionIntro({ eyebrow, title, body, tint = "var(--tool-income)", icon: Icon, center = false }: { eyebrow: string; title: React.ReactNode; body?: string; tint?: string; icon: LucideIcon; center?: boolean }) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`} data-reveal>
      <p className={`flex items-center gap-2 text-[0.9375rem] font-medium ${center ? "justify-center" : ""}`} style={{ color: tint }}>
        <Icon className="h-4 w-4" aria-hidden /> {eyebrow}
      </p>
      <h2 className="mt-3 text-4xl font-light tracking-tight sm:text-5xl">{title}</h2>
      {body && <p className="mt-4 text-lg leading-relaxed text-muted sm:text-xl">{body}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <div className="app-backdrop min-h-screen">
      <Nav />

      <main>
        {/* Hero: the launch coins on the brand hero card */}
        <section className="px-3 pt-3 sm:px-6 sm:pt-6">
          <div className="hero-card mx-auto max-w-6xl overflow-hidden">
            <HeroCoins />
            <div className="grid items-center gap-4 px-6 pb-12 pt-6 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:px-14 lg:py-20">
              <div className="relative order-first h-[210px] sm:h-[260px] lg:order-last lg:h-[420px]" data-coin-slot>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 text-center text-[0.8125rem] text-white/55 motion-reduce:hidden lg:-bottom-4" aria-hidden>
                  Tap the coins ✦
                </span>
              </div>
              <div className="text-center lg:text-left">
                <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.875rem] text-white/90">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold [animation:pulse-dot_2.4s_ease-in-out_infinite]" />
                  {TAX_YEAR} tax year · UK
                </span>
                <h1 className="mt-5 text-[2.75rem] font-light leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
                  Your UK tax,
                  <span className="block text-gold">made clearer.</span>
                </h1>
                <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl lg:mx-0">
                  Eleven calculators for your pay, your business and the year ahead. Personalised to you, with a live estimate as you type.
                </p>
                <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
                  <AppStoreButton variant="gold" />
                  <Link href="#tools" className="btn-glass glass press">
                    Explore the tools <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
                <p className="mt-6 text-[0.875rem] text-white/60">Free to download · iPhone &amp; iPad · Your calculations stay on your device</p>
              </div>
            </div>
          </div>
        </section>

        {/* Answer first: the live estimate */}
        <section id="estimate" className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-32">
          <div>
            <SectionIntro
              icon={Sparkles}
              eyebrow="Answer first"
              title={<>The answer, before<br className="hidden sm:block" /> you’ve finished typing.</>}
              body="Every TaxMate calculator opens with a live estimate that updates with each change, then tells you exactly what’s left to fill in. Try it: drag the salary."
            />
            <ul className="mt-8 grid gap-3 text-[1.0625rem]" data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
              {["Income Tax and National Insurance, including Scottish bands", "Pensions, student loans and payroll extras in the app", "Monthly, weekly or annual: whatever matches your payslip"].map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="tool-badge !h-6 !w-6 !rounded-full" style={{ ["--tint" as string]: "var(--tool-income)" }}>
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  <span className="text-muted">{t}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.8125rem] text-muted" data-reveal>
              A rough guide from salary alone ({TAX_YEAR}, under State Pension age). The app takes your full situation into account.
            </p>
          </div>
          <div data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
            <TakeHomeDemo />
          </div>
        </section>

        {/* Tools */}
        <section id="tools" className="border-y border-hairline bg-surface/50 py-24 lg:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionIntro
              icon={BarChart3}
              eyebrow="Eleven tools, three jobs"
              title="The calculators you actually need."
              body="Grouped by what you’re trying to do, not by tax jargon. Each group has its own colour, all the way through the app."
              center
            />
            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {GROUPS.map((group, gi) => (
                <div key={group.id} data-reveal style={{ ["--reveal-delay" as string]: `${gi * 90}ms`, ["--tint" as string]: group.tint }}>
                  {/* SectionHeading */}
                  <div className="mb-3.5 flex items-start gap-2.5 px-1">
                    <group.icon className="mt-0.5 h-5 w-5 flex-none" style={{ color: group.tint }} aria-hidden />
                    <div>
                      <h3 className="font-medium">{group.title}</h3>
                      <p className="text-[0.9375rem] text-muted">{group.summary}</p>
                    </div>
                  </div>
                  {/* RowsCard of BadgeRows */}
                  <ul className="surface-card overflow-hidden">
                    {group.tools.map((tool, i) => (
                      <li key={tool.title} className="badge-row relative flex min-h-[72px] items-center gap-3.5 px-4 py-3.5">
                        {i > 0 && <span className="absolute left-[74px] right-0 top-0 h-px bg-hairline" aria-hidden />}
                        <span className="tool-badge"><tool.icon className="h-5 w-5" aria-hidden /></span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium">{tool.title}</span>
                          <span className="block text-[0.9375rem] leading-snug text-muted">{tool.benefit}</span>
                        </span>
                        <ChevronRight className="h-4 w-4 flex-none text-muted/60" aria-hidden />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works: the onboarding coins */}
        <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
          <SectionIntro
            icon={Star}
            tint="var(--tool-claims)"
            eyebrow="How it works"
            title="Made for you in under a minute."
            body="TaxMate starts by getting to know you, so the first thing you see is what matters to you."
          />
          <div className="mt-12 grid gap-8 lg:mt-4 lg:grid-cols-2 lg:gap-16">
            <div className="lg:order-last">
              <div className="surface-card h-[300px] overflow-hidden sm:h-[360px] lg:sticky lg:top-28 lg:mt-16 lg:h-[520px]">
                <CoinStack faces={STEP_FACES} />
              </div>
            </div>
            <ol className="grid gap-4 lg:gap-0 lg:py-[14vh]">
              {STEPS.map((step, i) => (
                <li
                  key={step.title}
                  data-step
                  className="group flex gap-5 rounded-[22px] p-5 transition-all duration-500 lg:min-h-[38vh] lg:items-center lg:p-6 lg:opacity-40 lg:data-active:opacity-100"
                >
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-hairline bg-surface text-lg font-light tabular-nums transition-colors duration-500 group-data-active:border-transparent group-data-active:bg-brand group-data-active:text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-2xl font-light tracking-tight">{step.title}</h3>
                    <p className="mt-2 max-w-md text-[1.0625rem] leading-relaxed text-muted">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Key dates */}
        <section className="border-y border-hairline bg-surface/50 py-24 lg:py-32">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionIntro
                icon={CalendarClock}
                tint="var(--tool-planning)"
                eyebrow="Key dates"
                title="Never be surprised by a tax bill again."
                body="Your home screen counts down to the next HMRC date that applies to you, with the tool to prepare for it one tap away. Turn on reminders and TaxMate will nudge you in good time."
              />
            </div>
            <div data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
              <KeyDateCard />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
          <SectionIntro icon={Sparkles} eyebrow="Thoughtful details" title="Small touches that save real time." center />
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="surface-card p-6 transition-transform duration-300 hover:-translate-y-1"
                style={{ ["--tint" as string]: f.tint, ["--reveal-delay" as string]: `${(i % 3) * 80}ms` }}
                data-reveal
              >
                <span className="tool-badge"><f.icon className="h-5 w-5" aria-hidden /></span>
                <h3 className="mt-5 text-lg font-medium">{f.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy and Plus */}
        <section id="plus" className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:pb-32">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="surface-card flex flex-col p-7 sm:p-9" data-reveal style={{ ["--tint" as string]: "var(--tool-income)" }}>
              <span className="tool-badge" data-filled><Lock className="h-5 w-5" aria-hidden /></span>
              <h2 className="mt-6 text-3xl font-light tracking-tight sm:text-4xl">Private by design.</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                No account, no sign-up. Your answers and calculations are saved on your device, and they stay there.
              </p>
              <ul className="mt-auto grid gap-3 pt-8">
                {["No account to create", "Calculations saved on this device", "Reminders scheduled locally", "Not affiliated with HMRC"].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-income" aria-hidden />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hero-card p-7 sm:p-9" data-reveal style={{ ["--reveal-delay" as string]: "90ms" }}>
              <span className="eyebrow"><Sparkles className="h-4 w-4" aria-hidden /> One payment, yours for life</span>
              <h2 className="mt-3 text-4xl font-light tracking-tight sm:text-5xl">TaxMate Plus</h2>
              <p className="mt-3 max-w-lg text-lg text-white/80">
                Every calculator gives you a free estimate. Plus unlocks every tool in full, for good.
              </p>
              <ul className="mt-7 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {PLUS.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-[0.9875rem]">
                    <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-gold/90 text-brand-deep">
                      <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <AppStoreButton variant="gold" label="Get TaxMate" />
                <p className="text-[0.875rem] text-white/65 sm:ml-2">No subscription. One-time purchase in the app.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-hairline bg-surface/50 py-24 lg:py-32">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <SectionIntro icon={FileText} tint="var(--tool-planning)" eyebrow="FAQ" title="Questions, answered." center />
            <div className="mt-12 grid gap-3">
              {FAQ.map((f, i) => (
                <details key={f.q} className="disclosure-card surface-card group" data-reveal style={{ ["--reveal-delay" as string]: `${i * 50}ms` }}>
                  <summary className="flex items-center justify-between gap-4 rounded-[22px] px-6 py-5 text-[1.0625rem] font-medium">
                    {f.q}
                    <ChevronRight className="chevron h-5 w-5 flex-none text-muted transition-transform duration-300" aria-hidden />
                  </summary>
                  <p className="-mt-1 px-6 pb-6 leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing call to action: coins to play with */}
        <section className="px-3 py-16 sm:px-6 sm:py-24">
          <div className="hero-card mx-auto max-w-6xl overflow-hidden px-6 py-24 text-center sm:py-32">
            <CoinField />
            <span className="eyebrow justify-center"><Star className="h-4 w-4" aria-hidden /> Free on the App Store</span>
            <h2 className="mx-auto mt-4 max-w-2xl text-4xl font-light leading-tight tracking-tight sm:text-6xl">
              Start with a free estimate today.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-lg text-white/80">
              Download TaxMate for iPhone and iPad, answer a few quick questions, and see your tax picture in minutes.
            </p>
            <div className="mt-9 flex justify-center">
              <AppStoreButton variant="gold" />
            </div>
            <p className="mt-6 text-[0.8125rem] text-white/50 motion-reduce:hidden" aria-hidden>Go on, tap the card.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
