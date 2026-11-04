import Link from "next/link";
import { ArrowRight, Bell, Check, EyeOff, Lock, Plus, Smartphone } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { AppStoreButton } from "@/components/site/AppStoreButton";
import { AppQr } from "@/components/site/AppQr";
import { GetTheApp } from "@/components/site/GetTheApp";
import { AppRating } from "@/components/site/AppRating";
import { Story } from "@/components/story/Story";
import { PayPiles } from "@/components/sections/PayPiles";
import { ToolCoins } from "@/components/sections/ToolCoins";
import { YearTimeline } from "@/components/sections/YearTimeline";
import { PlusCoin } from "@/components/sections/PlusCoin";
import { CoinHeap } from "@/components/sections/CoinHeap";
import { Faq } from "@/components/sections/Faq";
import { TAX_YEAR } from "@/lib/site";
import { FAQ, PLUS } from "@/lib/content";
import { AUDIENCES } from "@/lib/audiences";
import { JsonLd } from "@/components/site/JsonLd";
import { faqSchema } from "@/lib/schema";

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
      <JsonLd data={faqSchema(FAQ)} />
      <Nav />
      <main>
        <Story rating={<AppRating className="text-white" />} />

        <div id="after-story" />

        {/* Your pay, in coins */}
        <section id="pay" className="mx-auto max-w-[1240px] px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28 lg:pb-40 lg:pt-36">
          <Heading kicker="Your pay, in coins" body="Every coin is a thousand pounds of salary. Drag it and watch what you keep, and what goes in tax, worked out the way TaxMate does it.">
            Drag the salary. <em>Watch it split.</em>
          </Heading>
          <div className="mt-12 sm:mt-16 lg:mt-20" data-reveal>
            <PayPiles />
          </div>
          <p className="mt-8 max-w-2xl text-[0.8125rem] text-muted sm:mt-10">
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
            <div className="mt-14 flex flex-wrap items-center gap-x-5 gap-y-3" data-reveal>
              <Link href="/calculators" className="btn-ghost press" data-cta="home-tools-calculators">Try the calculators free <ArrowRight className="h-4 w-4" aria-hidden /></Link>
              <span className="text-[0.9375rem] text-muted">Quick estimates on the web, from the same rules as the app.</span>
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
        <section className="px-3 py-24 sm:px-6 lg:py-32">
          {/* The anchor is the green card itself, so /#plus lands with its top just under the floating nav. */}
          <div id="plus" className="green mx-auto grid scroll-mt-[84px] max-w-[1240px] items-center gap-14 overflow-hidden rounded-[36px] px-7 py-14 sm:px-14 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-20">
            <div data-reveal>
              <p className="eyebrow !gap-2 !text-lg text-gold"><Plus className="h-5 w-5" strokeWidth={2.4} aria-hidden /> TaxMate Plus</p>
              <h2 className="display mt-5 text-[2.75rem] sm:text-6xl lg:text-7xl">
                One payment.
                <em className="block text-gold">Yours for life.</em>
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-white/75">
                Every estimate is free. Plus unlocks everything else.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <AppStoreButton variant="gold" label="Get TaxMate" placement="home-plus" />
                <span className="text-[0.875rem] text-white/60">One-time purchase in the app</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[440px] pt-6 lg:mr-6" data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
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
              <nav aria-label="Guides by situation" className="mt-10 hidden lg:block" data-reveal>
                <p className="text-[0.9375rem] text-muted">Guides for how you work</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {AUDIENCES.map((a) => (
                    <li key={a.slug}><Link href={`/for/${a.slug}`} className="check" style={{ ["--tint" as string]: a.tint }}>{a.label}</Link></li>
                  ))}
                </ul>
              </nav>
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
            <AppRating className="mt-6 justify-center text-white" />
            <p className="mx-auto mt-6 max-w-md text-lg text-white/75">For iPhone and iPad. A few quick questions, and your tax picture in minutes.</p>
            <GetTheApp placement="home-finale" qr={<AppQr campaign="home-finale-qr" className="block h-[148px] w-[148px]" />} />
            <p className="mt-6 text-[0.8125rem] text-white/45 motion-reduce:hidden" aria-hidden>Psst: tap the screen.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
