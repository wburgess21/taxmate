import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Bell,
  Briefcase,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  ClipboardList,
  Clock,
  CreditCard,
  FileClock,
  GraduationCap,
  KeyRound,
  LayoutGrid,
  Lock,
  MapPin,
  PiggyBank,
  PoundSterling,
  Settings,
  Share,
  Sparkles,
  SquareUser,
  Star,
  TrendingUp,
} from "lucide-react";

/* Small pieces of the app's design system (DesignSystem.swift), at point sizes. */

function Badge({ icon: Icon, tint, filled = false, size = 44 }: { icon: LucideIcon; tint: string; filled?: boolean; size?: number }) {
  return (
    <span className="app-badge" data-filled={filled || undefined} style={{ ["--tint" as string]: tint, width: size, height: size }}>
      <Icon size={size * 0.48} strokeWidth={2.1} />
    </span>
  );
}

function BadgeRow({ icon, tint, title, subtitle, filled, trailing, first }: { icon: LucideIcon; tint: string; title: string; subtitle: string; filled?: boolean; trailing?: React.ReactNode; first?: boolean }) {
  return (
    <div className="app-row" data-first={first || undefined} style={{ ["--tint" as string]: tint }} data-selected={filled || undefined}>
      <Badge icon={icon} tint={tint} filled={filled} />
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-medium leading-[22px]">{title}</span>
        <span className="app-secondary block text-[15px] leading-[20px]">{subtitle}</span>
      </span>
      {trailing ?? <ChevronRight size={14} strokeWidth={3} className="app-tertiary" />}
    </div>
  );
}

function StepProgress({ total, done, tint = "var(--tool-income)", message }: { total: number; done: number; tint?: string; message?: string }) {
  return (
    <div>
      <div className="flex gap-[5px]">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className="app-step" style={{ ["--tint" as string]: tint }} data-done={i < done || undefined} />
        ))}
      </div>
      {message && <p className="app-secondary mt-[8px] text-[13px]">{message}</p>}
    </div>
  );
}

function SectionHeading({ icon: Icon, tint, title, summary, trailing }: { icon: LucideIcon; tint: string; title: string; summary?: string; trailing?: React.ReactNode }) {
  return (
    <div className="mb-[14px] flex items-start gap-[8px]">
      <Icon size={18} strokeWidth={2.3} style={{ color: tint }} className="mt-[1px] flex-none" />
      <div className="min-w-0 flex-1">
        <p className="text-[17px] font-semibold leading-[22px]">{title}</p>
        {summary && <p className="app-secondary text-[15px] leading-[20px]">{summary}</p>}
      </div>
      {trailing}
    </div>
  );
}

function ActionBar({ label, tone = "brand" }: { label: string; tone?: "brand" | "inverted" }) {
  return (
    <div className="app-actionbar">
      <span className="app-primary" data-tone={tone}>{label}</span>
    </div>
  );
}

/* Screens */

export function WelcomeScreen({ shown }: { shown: boolean }) {
  return (
    <div className="app-screen app-welcome" data-shown={shown || undefined}>
      <div className="px-[20px] pt-[54px]">
        {/* The launch coins sit in this space, on the green. */}
        <div className="h-[236px]" data-anchor="welcome" />
        <div className="px-[8px]">
          <p className="rise text-[36px] font-light leading-[42px] text-white" style={{ ["--d" as string]: "0.1s" }}>Your UK tax, made clearer.</p>
          <p className="rise mt-[12px] text-[17px] leading-[25px] text-white/80" style={{ ["--d" as string]: "0.2s" }}>
            Answer a few quick questions and TaxMate will tailor your tools, key dates and tips.
          </p>
          <div className="mt-[24px] grid gap-[14px] text-[15px] text-white">
            {([[Sparkles, "Live estimates that update as you type"], [Lock, "Your answers and calculations stay on this device"], [ClipboardList, "Each tool explains its scope and assumptions"]] as const).map(([Icon, text], i) => (
              <p key={text} className="rise flex items-center gap-[10px]" style={{ ["--d" as string]: `${0.3 + i * 0.08}s` }}>
                <Icon size={17} strokeWidth={2.2} className="flex-none text-gold" /> {text}
              </p>
            ))}
          </div>
        </div>
      </div>
      <ActionBar label="Get started" tone="inverted" />
    </div>
  );
}

type Choice = { icon: LucideIcon; title: string; detail: string };
export type Question = { id: string; title: string; subtitle: string; tint: string; step: number; choices: Choice[]; picks: number[] };

export const QUESTIONS: Question[] = [
  {
    id: "situation", title: "What describes you?", subtitle: "Choose all that apply. This tailors your tools and dates.", tint: "var(--tool-income)", step: 1, picks: [1],
    choices: [
      { icon: Briefcase, title: "Employed (PAYE)", detail: "Paid through payroll by an employer" },
      { icon: SquareUser, title: "Self-employed", detail: "Sole trader or freelancer" },
      { icon: Building2, title: "Company director", detail: "Paid through your own limited company" },
      { icon: KeyRound, title: "Landlord", detail: "Rental income from UK property" },
      { icon: Sparkles, title: "Just exploring", detail: "See what TaxMate can do first" },
    ],
  },
  {
    id: "region", title: "Where do you live?", subtitle: "Scotland sets its own Income Tax rates.", tint: "var(--tool-income)", step: 2, picks: [0],
    choices: [
      { icon: MapPin, title: "England", detail: "UK Income Tax rates" },
      { icon: MapPin, title: "Scotland", detail: "Scottish Income Tax rates" },
      { icon: MapPin, title: "Wales", detail: "UK Income Tax rates" },
      { icon: MapPin, title: "Northern Ireland", detail: "UK Income Tax rates" },
    ],
  },
  {
    id: "goals", title: "What would you like help with?", subtitle: "Pick up to 3.", tint: "var(--tool-claims)", step: 5, picks: [1, 3, 4],
    choices: [
      { icon: Banknote, title: "Know my take-home pay", detail: "See your pay after tax, NI and loans" },
      { icon: PoundSterling, title: "Estimate my tax bill", detail: "Understand what you'll owe" },
      { icon: CreditCard, title: "Claim expenses & relief", detail: "Lower your bill with allowable costs" },
      { icon: CalendarDays, title: "Save for my tax bill", detail: "Put money aside for payment dates" },
      { icon: FileClock, title: "Get ready for MTD", detail: "Check if and when MTD applies" },
      { icon: TrendingUp, title: "Pension tax relief", detail: "Compare cash and pension contributions" },
      { icon: Bell, title: "Never miss a deadline", detail: "Know your key HMRC dates" },
    ],
  },
];

/** One onboarding question. `picked` is how many of its picks have been made so far. */
export function QuestionScreen({ q, shown, picked }: { q: Question; shown: boolean; picked: number }) {
  const chosen = new Set(q.picks.slice(0, picked));
  return (
    <div className="app-screen app-question" data-shown={shown || undefined}>
      <div className="app-nav"><ChevronLeft size={22} strokeWidth={2.6} /> Back</div>
      <div className="px-[20px]">
        <StepProgress total={6} done={q.step} message={`Step ${q.step} of 6`} />
        {/* CoinSlotRow: the hero coin (left) and the progress stack (right). */}
        <div className="mt-[10px] flex h-[66px] items-end justify-between">
          <div className="h-[58px] w-[58px]" data-anchor={`hero-${q.id}`} />
          <div className="mr-[6px] h-[60px] w-[60px]" data-anchor={`stack-${q.id}`} />
        </div>
        <div className="mt-[12px]">
          <p className="text-[36px] font-light leading-[42px]">{q.title}</p>
          <p className="app-secondary mt-[12px] text-[17px] leading-[24px]">{q.subtitle}</p>
        </div>
        <div className="app-card mt-[24px] overflow-hidden">
          {q.choices.map((c, i) => {
            const on = chosen.has(i);
            return (
              <BadgeRow
                key={c.title}
                first={i === 0}
                icon={c.icon}
                tint={q.tint}
                title={c.title}
                subtitle={c.detail}
                filled={on}
                trailing={on ? <CheckCircle2 size={22} strokeWidth={2.2} className="app-check" style={{ color: q.tint }} /> : <Circle size={22} strokeWidth={1.6} className="app-tertiary" />}
              />
            );
          })}
        </div>
      </div>
      <ActionBar label="Next" />
    </div>
  );
}

export function PersonalisingScreen({ shown }: { shown: boolean }) {
  return (
    <div className="app-screen app-personalising" data-shown={shown || undefined}>
      <p className="absolute inset-x-0 top-[470px] text-center text-[30px] font-light text-white">Personalising…</p>
    </div>
  );
}

export function HomeScreen({ state, keyDate }: { state: "shown" | "behind" | "hidden"; keyDate: { title: string; days: number; date: string; detail: string } }) {
  return (
    <div className="app-screen app-push" data-state={state}>
      <div className="px-[20px] pt-[62px]">
        <div className="flex items-center justify-between">
          <span className="app-glass-tag">2026/27 · England</span>
          {/* HomeLogo: the coins land here. */}
          <span className="mr-[2px] h-[40px] w-[39px]" data-anchor="logo" />
        </div>
        <p className="mt-[14px] text-[36px] font-light leading-[42px]">Calculators</p>
        <p className="app-secondary mt-[2px] text-[20px] leading-[25px]">Your UK tax, made clearer.</p>

        <div className="app-hero mt-[28px]">
          <div className="flex items-center justify-between text-[15px] text-gold">
            <span className="flex items-center gap-[6px]"><CalendarDays size={16} strokeWidth={2.2} /> Next key date</span>
            <Bell size={15} fill="currentColor" className="text-white/90" />
          </div>
          <p className="mt-[12px] text-[20px] leading-[25px] text-white">{keyDate.title}</p>
          <p className="mt-[2px] flex items-baseline gap-[8px] text-white">
            <span className="text-[36px] font-light leading-[42px] tabular-nums">{keyDate.days}</span>
            <span className="text-[17px] text-white/75">{keyDate.days === 1 ? "day to go" : "days to go"}</span>
          </p>
          <p className="mt-[4px] text-[15px] leading-[20px] text-white/75">{keyDate.date} · {keyDate.detail}</p>
          <span className="app-hero-button mt-[16px]">Plan your payments <ChevronRight size={16} strokeWidth={3} /></span>
        </div>

        <div className="mt-[36px]">
          <SectionHeading icon={Star} tint="var(--tool-claims)" title="For you" summary="Picked based on your preferences." />
          <div className="app-card overflow-hidden">
            <BadgeRow first icon={Briefcase} tint="var(--tool-income)" title="Self-employed Tax" subtitle="Because you want to estimate your tax bill" />
            <BadgeRow icon={CalendarDays} tint="var(--tool-planning)" title="Tax Savings Planner" subtitle="Because you want to save for your tax bill" />
            <BadgeRow icon={FileClock} tint="var(--tool-planning)" title="Making Tax Digital" subtitle="Because you want to get ready for MTD" />
          </div>
        </div>
      </div>
      <div className="app-tabbar">
        <span data-on><LayoutGrid size={22} strokeWidth={2.2} />Calculators</span>
        <span><Clock size={22} strokeWidth={2.2} />History</span>
        <span><Settings size={22} strokeWidth={2.2} />Settings</span>
      </div>
    </div>
  );
}

const gbp2 = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);

/** The worked example: £48,000 turnover, £6,000 expenses, England, 2026/27 (Income Tax 20%, Class 4 NI 6%). */
export const EXAMPLE = (() => {
  const calc = (profit: number) => {
    const tax = Math.max(0, profit - 12_570) * 0.2;
    const ni = Math.max(0, Math.min(profit, 50_270) - 12_570) * 0.06;
    return { profit, tax, ni, total: tax + ni, kept: profit - tax - ni };
  };
  return { beforeExpenses: calc(48_000), final: calc(42_000) };
})();

/** Self-employed Tax, with its live estimate. `ticks` is how many sections have been reviewed (0–3). */
export function CalculatorScreen({ state, ticks, amount }: { state: "shown" | "behind" | "hidden"; ticks: number; amount: number }) {
  const est = ticks >= 2 ? EXAMPLE.final : EXAMPLE.beforeExpenses;
  const keep = est.kept / est.profit;
  const rows: [LucideIcon, string, string][] = [
    [Banknote, "Business income", "£48,000 turnover"],
    [CreditCard, "Expenses", "£6,000 allowable costs"],
    [GraduationCap, "Student loan", "No student loan"],
  ];
  return (
    <div className="app-screen app-push" data-state={state}>
      <div className="px-[20px] pt-[58px]">
        <span className="app-glass-circle"><ChevronLeft size={22} strokeWidth={2.6} /></span>
        <div className="mt-[10px]"><Badge icon={Briefcase} tint="var(--tool-income)" /></div>
        <p className="mt-[12px] text-[36px] font-light leading-[42px]">Self-employed Tax</p>
        <p className="app-secondary mt-[4px] text-[17px]">Understand your annual business tax</p>

        <div className="app-hero mt-[22px] min-h-[206px]">
          {ticks === 0 ? (
            <>
              <p className="flex items-center gap-[6px] text-[15px] text-gold"><Sparkles size={16} strokeWidth={2.2} /> Start here</p>
              <p className="mt-[12px] text-[20px] text-white">What will you owe?</p>
              <p className="mt-[4px] text-[15px] leading-[20px] text-white/75">Add your business income to see a live estimate.</p>
              <span className="app-hero-button mt-[18px]">Add income <ChevronRight size={16} strokeWidth={3} /></span>
            </>
          ) : (
            <>
              <p className="flex items-center gap-[6px] text-[15px] text-gold"><Sparkles size={16} strokeWidth={2.2} /> Live estimate</p>
              <p className="mt-[10px] text-[36px] font-light leading-[42px] text-white tabular-nums">{gbp2(amount)}</p>
              <p className="text-[20px] leading-[25px] text-white">tax and NI for 2026/27</p>
              <p className="mt-[4px] text-[15px] text-white/75">On {gbp2(est.profit).replace(".00", "")} profit · England</p>
              <div className="mt-[14px] flex h-[8px] gap-[2px] overflow-hidden rounded-full">
                <span className="h-full rounded-full bg-white transition-[width] duration-700" style={{ width: `${keep * 100}%` }} />
                <span className="h-full flex-1 rounded-full bg-gold" />
              </div>
            </>
          )}
        </div>

        <div className="mt-[30px]">
          <SectionHeading icon={ClipboardList} tint="var(--tool-income)" title="Your details" trailing={<span className="app-secondary text-[15px] tabular-nums">{Math.round((ticks / 3) * 100)}%</span>} />
          <StepProgress total={3} done={ticks} message={ticks === 3 ? "Ready to calculate" : `${3 - ticks} to review`} />
          <div className="app-card mt-[14px] overflow-hidden">
            {rows.map(([icon, title, sub], i) => (
              <BadgeRow
                key={title}
                first={i === 0}
                icon={icon}
                tint="var(--tool-income)"
                title={title}
                subtitle={sub}
                filled={i < ticks}
                trailing={i < ticks ? <Check size={18} strokeWidth={3} className="app-check" style={{ color: "var(--tool-income)" }} /> : undefined}
              />
            ))}
          </div>
        </div>
      </div>
      <ActionBar label="Calculate" />
    </div>
  );
}

export function ResultSheet({ shown }: { shown: boolean }) {
  const r = EXAMPLE.final;
  const keepPct = Math.round((r.kept / r.profit) * 100);
  const seg = (v: number) => `${(v / r.profit) * 100}%`;
  return (
    <div className="app-sheet" data-shown={shown || undefined}>
      <div className="flex items-center justify-between px-[16px] pt-[14px]">
        <span className="app-glass-circle !h-[40px] !w-[40px]"><Share size={18} strokeWidth={2.2} /></span>
        <span className="app-glass-pill">Done</span>
      </div>
      <div className="px-[20px] pt-[12px]">
        <div className="app-hero">
          <p className="flex items-center gap-[6px] text-[15px] text-gold"><Check size={16} strokeWidth={3} /> Saved to your history</p>
          <p className="mt-[10px] text-[30px] font-light leading-[36px] text-white">Your tax bill</p>
          <p className="sheet-amount mt-[2px] text-[48px] font-light leading-[56px] tracking-[-0.5px] text-white tabular-nums">{gbp2(r.total)}</p>
          <p className="text-[15px] text-white/75">Income Tax and Class 4 NI for 2026/27</p>
          <div className="mt-[16px] flex h-[8px] gap-[2px] overflow-hidden rounded-full">
            <span className="h-full rounded-full bg-white" style={{ width: seg(r.kept) }} />
            <span className="h-full flex-1 rounded-full bg-gold" />
          </div>
          <div className="mt-[10px] flex gap-[16px] text-[13px] text-white/80">
            <span className="flex items-center gap-[6px]"><span className="h-[8px] w-[8px] rounded-full bg-white" />You keep {keepPct}%</span>
            <span className="flex items-center gap-[6px]"><span className="h-[8px] w-[8px] rounded-full bg-gold" />Tax &amp; NI {100 - keepPct}%</span>
          </div>
        </div>
        <div className="mt-[30px]">
          <SectionHeading icon={PiggyBank} tint="var(--tool-income)" title="Where it goes" />
          <div className="app-card px-[20px] py-[18px]">
            <div className="flex h-[12px] gap-[2px] overflow-hidden rounded-full">
              <span className="sheet-seg rounded-full" style={{ width: seg(r.kept), background: "var(--tool-income)" }} />
              <span className="sheet-seg rounded-full" style={{ width: seg(r.tax), background: "var(--tool-claims)", ["--d" as string]: "0.1s" }} />
              <span className="sheet-seg rounded-full" style={{ width: seg(r.ni), background: "var(--tool-planning)", ["--d" as string]: "0.2s" }} />
            </div>
            {([["Profit kept", r.kept, "var(--tool-income)"], ["Income Tax", r.tax, "var(--tool-claims)"], ["Class 4 NI", r.ni, "var(--tool-planning)"]] as const).map(([label, v, c]) => (
              <p key={label} className="mt-[14px] flex items-center justify-between text-[17px]">
                <span className="flex items-center gap-[8px]"><span className="h-[8px] w-[8px] rounded-full" style={{ background: c }} />{label}</span>
                <span className="tabular-nums">{gbp2(v)}</span>
              </p>
            ))}
            <p className="mt-[14px] flex items-center justify-between border-t border-hairline pt-[14px] text-[17px] font-semibold">
              <span>Profit</span><span className="tabular-nums">{gbp2(r.profit)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
