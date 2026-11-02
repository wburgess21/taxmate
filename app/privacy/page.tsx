import { Bell, Lock, Share2, Smartphone } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata = {
  title: "Privacy Policy",
  description: "How TaxMate handles your information: your calculations stay on your device, with no account and no in-app analytics.",
  alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "2 November 2026";

const SUMMARY = [
  { icon: Smartphone, title: "Stored on your device", body: "Everything you enter is saved in the app on your iPhone or iPad. We don’t have servers that receive it." },
  { icon: Lock, title: "No account, no tracking", body: "There’s no sign-up, and the app contains no analytics, advertising or tracking code." },
  { icon: Bell, title: "Reminders stay local", body: "Deadline reminders are scheduled on your device by iOS. Nothing is sent to us." },
  { icon: Share2, title: "You choose what to share", body: "PDFs, CSVs and payday cards only leave your device when you share them." },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[radial-gradient(1000px_700px_at_0%_0%,var(--glow),transparent_70%)]">
      <Nav />
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-32 sm:px-6 sm:pb-24 sm:pt-40">
        <h1 className="text-4xl font-light tracking-tight sm:text-5xl">Privacy Policy</h1>
        <p className="mt-3 text-muted">Last updated: {LAST_UPDATED}</p>

        <section aria-labelledby="in-short" className="mt-10">
          <h2 id="in-short" className="sr-only">In short</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {SUMMARY.map((s) => (
              <li key={s.title} className="surface-card flex gap-4 p-5" style={{ ["--tint" as string]: "var(--tool-income)" }}>
                <span className="tool-badge"><s.icon className="h-5 w-5" aria-hidden /></span>
                <span>
                  <span className="block font-medium">{s.title}</span>
                  <span className="mt-1 block text-[0.9375rem] leading-relaxed text-muted">{s.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="surface-card legal mt-6 p-7 sm:p-12">
          <section className="mb-12">
            <h2>Introduction</h2>
            <p className="mb-4">
              This policy explains how TaxMate (&ldquo;we&rdquo;, &ldquo;our&rdquo; or &ldquo;us&rdquo;) handles information
              when you use the TaxMate app for iPhone and iPad (&ldquo;the app&rdquo;) and this website,
              www.taxmate-app.com (&ldquo;the website&rdquo;).
            </p>
            <p className="mb-4">
              TaxMate is designed so that your financial information never reaches us. The app works entirely on your
              device: there is no account to create, and the figures you enter are not sent to us or to anyone else
              unless you choose to share them.
            </p>
          </section>

          <section className="mb-12">
            <h2>Information you enter in the app</h2>
            <p className="mb-4">
              To give you estimates, the app stores what you enter in its calculators and settings. Depending on the
              tools you use, this can include:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <li>
                <strong className="font-medium text-ink">Profile answers</strong> from onboarding or Settings: your work
                situation (for example employed, self-employed or landlord), the part of the UK you pay tax in, income and
                business turnover bands, your goals, student loan plan, and workplace pension details. Any question can be
                answered &ldquo;Prefer not to say&rdquo; or &ldquo;Not sure&rdquo;, and the details step can be skipped.
              </li>
              <li>
                <strong className="font-medium text-ink">Pay and income figures</strong>: salary and pay frequency,
                pension contributions, student loan repayments, business revenue and expenses, and other income used by
                Take Home Pay, Self-employed Tax and Combined Income.
              </li>
              <li>
                <strong className="font-medium text-ink">Costs and claims</strong>: household costs, working hours and
                rooms for Home Office; business expenses; journeys and distances for Business Mileage; and pension
                contribution comparisons.
              </li>
              <li>
                <strong className="font-medium text-ink">Planning records</strong>: tax savings plans and payments you
                record, VAT turnover, Making Tax Digital checks and annual summaries.
              </li>
              <li>
                <strong className="font-medium text-ink">Text you type</strong>, such as names for saved comparisons,
                journey purposes, vehicle names and notes.
              </li>
              <li>
                <strong className="font-medium text-ink">Your history</strong>: saved results, &ldquo;What if?&rdquo;
                comparisons and in-progress drafts, so you can pick up where you left off.
              </li>
              <li>
                <strong className="font-medium text-ink">App records and preferences</strong>: when you accepted the
                in-app disclaimer (the date and version), your reminder settings, your progress through onboarding, and
                whether you have bought TaxMate Plus.
              </li>
            </ul>
            <p className="mb-4">
              All of this is stored only on your device, in the app&rsquo;s private storage. We cannot see it, and we do not
              collect, sell or share it. We use it for one purpose: running the app&rsquo;s features for you, such as
              calculating estimates, suggesting tools and key dates that fit your answers, filling a new calculator from
              figures you&rsquo;ve already entered (Smart fill), and showing your history.
            </p>
          </section>

          <section className="mb-12">
            <h2>What the app does not do</h2>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <li>It does not ask you to create an account or sign in.</li>
              <li>It does not send your figures, answers or history to us or to any server.</li>
              <li>It contains no analytics, advertising, tracking or crash-reporting software, and does not track you across other apps or websites.</li>
              <li>It does not ask for access to your location, contacts, photos, camera or microphone.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2>Reminders</h2>
            <p className="mb-4">
              Deadline reminders are optional. If you turn them on, iOS asks for permission to show notifications.
              Reminders are created and scheduled on your device using the dates and timing you choose; their content is
              not sent to us. You can turn them off in the app or in your device&rsquo;s Settings at any time.
            </p>
          </section>

          <section className="mb-12">
            <h2>Sharing and exports</h2>
            <p className="mb-4">
              Some features create files or images you can share: result summaries, Annual Summary PDF and CSV exports,
              and &ldquo;Share your payday&rdquo; cards. These are generated on your device and only leave it when you
              choose where to send them using the iOS share sheet, for example to your accountant, to Files or to a
              messaging app. Once shared, the information is handled by the app or person you shared it with, under their
              own privacy terms. Check what a file contains before you share it.
            </p>
          </section>

          <section className="mb-12">
            <h2>Purchases</h2>
            <p className="mb-4">
              TaxMate Plus is bought through Apple&rsquo;s App Store. Apple processes the payment; we never receive your
              payment details. The app checks your purchase with Apple on your device and remembers on the device that Plus
              is unlocked. Apple&rsquo;s handling of purchases is covered by{" "}
              <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer">Apple&rsquo;s privacy policy</a>.
            </p>
          </section>

          <section className="mb-12">
            <h2>Information from Apple</h2>
            <p className="mb-4">
              Like all App Store developers, we may receive aggregated statistics from Apple, such as download numbers,
              and crash reports from people who have chosen to share them with app developers in their device settings.
              This information does not include what you have entered in TaxMate and does not identify you to us. You can
              change this choice in Settings › Privacy &amp; Security › Analytics &amp; Improvements.
            </p>
          </section>

          <section className="mb-12">
            <h2>Backups and deleting your data</h2>
            <p className="mb-4">
              Because your data lives in the app on your device, it may be included in your device&rsquo;s iCloud or
              computer backups if you have backups turned on. Those backups are handled by Apple under your Apple account
              settings, not by us.
            </p>
            <p className="mb-4">You stay in control of your data:</p>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <li>Delete individual results from your history in the app.</li>
              <li>Clear your profile answers with Settings › Your profile › Reset profile (your drafts and results are kept).</li>
              <li>Delete everything by deleting the app from your device. This removes all of the app&rsquo;s data, apart from any copies in your backups or files you have shared.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2>This website</h2>
            <p className="mb-4">
              The website is hosted by Vercel Inc. When you visit it, Vercel processes technical information needed to
              deliver the pages, such as your IP address and browser details, and may keep it briefly in server logs for
              security and reliability.
            </p>
            <p className="mb-4">
              We use Vercel Web Analytics to understand how the website is used in aggregate: for example pages viewed,
              the referring site, and approximate country, browser and device type. It does not use cookies and does not
              let us identify individual visitors. The website does not use advertising or tracking cookies.
            </p>
            <p className="mb-4">
              The take-home pay estimate and key date countdown on the website run entirely in your browser. The salary
              you choose is not sent anywhere.
            </p>
          </section>

          <section className="mb-12">
            <h2>If you contact us</h2>
            <p className="mb-4">
              If you email us, we use your email address and the contents of your message to reply and to help with your
              question. We keep the correspondence only as long as needed for that, and do not use it for marketing.
            </p>
          </section>

          <section className="mb-12">
            <h2>Legal basis and your rights</h2>
            <p className="mb-4">
              We follow the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. The small
              amount of personal data we do process (website analytics and server logs, and emails you send us) is
              processed on the basis of our legitimate interests in running a secure, working website and answering your
              questions.
            </p>
            <p className="mb-4">
              You have the right to ask for access to, correction of, or deletion of personal data we hold about you, to
              object to or restrict our processing of it, and to data portability. As the information you enter in the
              app is held only on your device, you can view, change, export or delete it yourself at any time. To exercise
              your rights about anything else, email us. You also have the right to complain to the Information
              Commissioner&rsquo;s Office (
              <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">ico.org.uk</a>
              ), though we&rsquo;d appreciate the chance to help first.
            </p>
          </section>

          <section className="mb-12">
            <h2>International transfers</h2>
            <p className="mb-4">
              The app does not transfer the information you enter anywhere. Vercel, which hosts the website and provides
              its analytics, may process website data in the United States and other countries. Where it does, the transfer is
              covered by the safeguards that UK data protection law requires.
            </p>
          </section>

          <section className="mb-12">
            <h2>Security</h2>
            <p className="mb-4">
              Keeping your data on your device means it is protected by your device&rsquo;s own security, including your
              passcode, Face ID or Touch ID, and data protection encryption. We recommend keeping your device locked and
              up to date. The website is served only over HTTPS.
            </p>
          </section>

          <section className="mb-12">
            <h2>Children&rsquo;s privacy</h2>
            <p className="mb-4">
              TaxMate is not intended for use by children under the age of 18. We do not knowingly collect personal
              information from children under 18. If you are a parent or guardian and believe your child has provided us
              with personal information, please contact us.
            </p>
          </section>

          <section className="mb-12">
            <h2>Not tax advice</h2>
            <p className="mb-4">
              TaxMate is not affiliated with HMRC. It is a planning tool that gives estimates based on published HMRC
              guidance and the figures you enter; it does not constitute tax advice. You are responsible for:
            </p>
            <ul className="mb-4 list-disc space-y-2 pl-6">
              <li>Ensuring the accuracy of the information you enter</li>
              <li>Keeping records and evidence for anything you claim</li>
              <li>Complying with HMRC requirements</li>
              <li>Seeking professional tax advice if needed</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2>Changes to this policy</h2>
            <p className="mb-4">
              We may update this policy as the app changes, for example if a new feature handles information differently.
              We will post the updated policy on this page and change the &ldquo;Last updated&rdquo; date.
            </p>
          </section>

          <section>
            <h2>Contact us</h2>
            <p className="mb-4">If you have any questions about this policy or about your privacy, please contact us at:</p>
            <p className="mb-4">
              Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
