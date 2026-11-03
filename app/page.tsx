import { Bell, Check, EyeOff, Lock, Plus, Smartphone } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { AppStoreButton } from "@/components/site/AppStoreButton";
import { AppQr } from "@/components/site/AppQr";
import { GetTheApp } from "@/components/site/GetTheApp";
import { Story } from "@/components/story/Story";
import { PayPiles } from "@/components/sections/PayPiles";
import { ToolCoins } from "@/components/sections/ToolCoins";
import { YearTimeline } from "@/components/sections/YearTimeline";
import { PlusCoin } from "@/components/sections/PlusCoin";
import { CoinHeap } from "@/components/sections/CoinHeap";
import { Faq } from "@/components/sections/Faq";
import { TAX_YEAR } from "@/lib/site";

const PLUS = [
  "Home Office reports",
  "Saved tax savings plans",
  "Manual journey logs",
  "Named expense comparisons",
  "Annual PDF and CSV summaries",
  "Pension comparisons",
  "Combined-income planning",
  "Rolling VAT monitoring",
  "Plan and VAT reminders",
];

const FAQ = [
  { q: "Is TaxMate free?", a: "Yes. It’s free to download, and every calculator gives you a free estimate. TaxMate Plus is a single, one-time purchase that unlocks saved reports, plans, journey logs, exports and monitoring. There’s no subscription." },
  { q: "Where are my answers and calculations stored?", a: "On your device. There’s no account to create, and your calculations aren’t sent to us. Deadline reminders are scheduled locally on your iPhone or iPad." },
  { q: "Which tax year does it use?", a: `Estimates use ${TAX_YEAR} HMRC rates and thresholds, including Scottish Income Tax bands. The rules are checked against GOV.UK guidance and updated for each new tax year.` },
  { q: "Who is TaxMate for?", a: "Employees checking their pay, sole traders and freelancers, company directors, landlords, and anyone with a salary and side income. Answer a few questions and TaxMate brings forward the tools that fit you." },
  { q: "Is this tax advice? Is TaxMate affiliated with HMRC?", a: "No to both. TaxMate is an independent planning tool built on published HMRC guidance. Estimates depend on the figures you enter, so keep your records and check anything important with HMRC or an accountant." },
  { q: "Can I share results with my accountant?", a: "Yes. Results can be shared, and with Plus the Annual Summary exports your selected planning records as a PDF or CSV." },
];

const PRIVACY = [
  { icon: Lock, title: "No account", body: "No sign-up, no password, no email address. Open it and start." },
  { icon: Smartphone, title: "Saved on your device", body: "Answers, drafts and results live in the app, on your iPhone or iPad." },
  { icon: EyeOff, title: "No tracking", body: "No analytics, advertising or tracking code inside the app." },
  { icon: Bell, title: "Local reminders", body: "Deadline reminders are scheduled by iOS on your device." },
];

function Heading({ kicker, children, body, center = false }: { kicker: string; children: React.ReactNode; body?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} data-reveal>
      <p className="kicker">{kicker}</p>
      <h2 className="display mt-5 text-[2.75rem] sm:text-6xl lg:text-[5rem]">{children}</h2>
      {body && <p className={`mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl ${center ? "mx-auto" : ""}`}>{body}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Story />

        <div id="after-story" />

        {/* Your pay, in coins */}
        <section id="pay" className="mx-auto max-w-[1240px] px-5 pb-28 pt-28 sm:px-8 lg:pb-40 lg:pt-36">
          <Heading kicker="Your pay, in coins" body="Every coin is a thousand pounds of salary. Drag it and watch what you keep, and what goes in tax, worked out the way TaxMate does it.">
            Drag the salary. <em>Watch it split.</em>
          </Heading>
          <div className="mt-16 lg:mt-20" data-reveal>
            <PayPiles />
          </div>
          <p className="mt-10 max-w-2xl text-[0.8125rem] text-muted">
            A rough guide from salary alone, using {TAX_YEAR} bands for someone under State Pension age. In the app, Take Home Pay adds pensions, student loans, tax codes and payroll extras.
          </p>
        </section>

        {/* Tools */}
        <section id="tools" className="border-t border-hairline bg-surface/40 py-28 lg:py-40">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
            <Heading kicker="Eleven tools" body="Grouped by what you’re trying to do, not by tax jargon. Each group keeps its colour all the way through the app.">
              From payday <em>to tax return.</em>
            </Heading>
            <div className="mt-16 lg:mt-24" data-reveal>
              <ToolCoins />
            </div>
          </div>
        </section>

        {/* Key dates */}
        <section id="dates" className="mx-auto max-w-[1240px] px-5 py-28 sm:px-8 lg:py-40">
          <Heading kicker="Key dates" body="The home screen counts down to the next HMRC date that applies to you. Turn on free reminders and TaxMate nudges you a week before, and on the day.">
            The tax year, <em>counted down.</em>
          </Heading>
          <div className="mt-16 lg:mt-20" data-reveal>
            <YearTimeline />
          </div>
        </section>

        {/* Privacy */}
        <section className="border-y border-hairline bg-surface/40 py-28 lg:py-40">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
            <Heading kicker="Private by design">
              Your numbers <em>stay on your phone.</em>
            </Heading>
            <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4" data-reveal>
              {PRIVACY.map(({ icon: Icon, title, body }) => (
                <div key={title}>
                  <Icon className="h-6 w-6 text-income" strokeWidth={1.8} aria-hidden />
                  <h3 className="mt-5 text-xl font-light tracking-tight">{title}</h3>
                  <p className="mt-2 leading-relaxed text-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plus: a receipt for a one-off payment */}
        <section id="plus" className="px-3 py-24 sm:px-6 lg:py-32">
          <div className="green mx-auto grid max-w-[1240px] items-center gap-14 overflow-hidden rounded-[36px] px-7 py-14 sm:px-14 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-20" data-reveal>
            <div>
              <p className="eyebrow !gap-2 !text-lg text-gold"><Plus className="h-5 w-5" strokeWidth={2.4} aria-hidden /> TaxMate Plus</p>
              <h2 className="display mt-5 text-[2.75rem] sm:text-6xl lg:text-7xl">
                One payment.
                <em className="block text-gold">Yours for life.</em>
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-white/75">
                Every estimate is free. Plus unlocks everything else.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <AppStoreButton variant="gold" label="Get TaxMate" />
                <span className="text-[0.875rem] text-white/60">One-time purchase in the app</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[440px] pt-6 lg:mr-6">
              <div className="receipt-wrap">
                <div className="receipt">
                  <p className="text-center font-mono text-[0.8125rem] font-medium tracking-[0.2em]">TAXMATE PLUS</p>
                  <p className="mt-1 text-center text-[0.8125rem] text-[#1b221d]/55">Everything it unlocks</p>
                  <div className="receipt-rule" />
                  <ul>
                    {PLUS.map((p) => (
                      <li key={p} className="receipt-line">
                        <span>{p}</span>
                        <span className="leader" aria-hidden />
                        <Check className="h-4 w-4 flex-none translate-y-[3px] text-[#1b7a46]" strokeWidth={2.6} aria-label="Included" />
                      </li>
                    ))}
                  </ul>
                  <div className="receipt-rule" />
                  <p className="receipt-line"><span>Monthly fee</span><span className="leader" aria-hidden /><span className="font-mono">£0.00</span></p>
                  <p className="receipt-line"><span>Renewals</span><span className="leader" aria-hidden /><span className="font-mono">None</span></p>
                  <p className="receipt-line text-[1.0625rem] font-semibold"><span>Yours</span><span className="leader" aria-hidden /><span>For life</span></p>
                  <p className="mt-5 text-center text-[0.75rem] tracking-[0.2em] text-[#1b221d]/45">THANK YOU ✦</p>
                </div>
              </div>
              {/* The gold coin, resting on the receipt's corner. */}
              <div className="pointer-events-auto absolute -right-5 -top-20 h-32 w-32 sm:-right-14 sm:-top-24 sm:h-56 sm:w-56">
                <PlusCoin />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-[1240px] px-5 pb-28 pt-8 sm:px-8 lg:pb-40">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Heading kicker="Questions">Good <em>questions.</em></Heading>
            </div>
            <div data-reveal>
              <Faq items={FAQ} />
            </div>
          </div>
        </section>

        {/* Finale */}
        <section className="px-3 pb-6 sm:px-6">
          <div className="green green-lit finale-card relative mx-auto max-w-[1400px] overflow-hidden rounded-[36px] px-6 pt-28 text-center sm:pt-36">
            <CoinHeap />
            <p className="eyebrow justify-center text-gold">Free on the App Store</p>
            <h2 className="display mx-auto mt-6 max-w-4xl text-[3rem] sm:text-7xl lg:text-[6.5rem]">
              Your UK tax, <em className="text-gold">made clearer.</em>
            </h2>
            <p className="mx-auto mt-6 max-w-md text-lg text-white/75">For iPhone and iPad. A few quick questions, and your tax picture in minutes.</p>
            <GetTheApp qr={<AppQr className="block h-[148px] w-[148px]" />} />
            <p className="mt-6 text-[0.8125rem] text-white/45 motion-reduce:hidden" aria-hidden>Psst: tap the screen.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
