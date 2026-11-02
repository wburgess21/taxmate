import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for TaxMate, the UK tax calculator app for iPhone and iPad.",
};

export default function PrivacyPolicy() {
  return (
    <div className="app-backdrop min-h-screen">
      <Nav />
      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="surface-card p-7 sm:p-12">
        <h1 className="text-4xl font-light tracking-tight sm:text-5xl">Privacy Policy</h1>
        <p className="mt-3 text-muted">Last updated: January 4, 2026</p>

        <hr className="my-10 border-hairline" />

        <div className="legal">
          <section className="mb-12">
            <h2 className="mb-4">Introduction</h2>
            <p className="mb-4">
              TaxMate (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy 
              Policy explains how we collect, use, and safeguard your information when you use our 
              mobile application.
            </p>
            <p className="mb-4">
              By using TaxMate, you agree to the collection and use of information in accordance 
              with this policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4">Information We Collect</h2>
            
            <h3>Information You Provide</h3>
            <p className="mb-4">
              When you use TaxMate, you may provide the following information:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Work pattern information (hours worked per day)</li>
              <li>Household expense data (rent, mortgage interest, council tax, utilities, etc.)</li>
              <li>Room usage information (total rooms, exclusive business use, dual use)</li>
              <li>Calculation history and saved results</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p className="mb-4">
              We may automatically collect certain information when you use the app:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Device information (device type, operating system version)</li>
              <li>Usage data (features used, calculation frequency)</li>
              <li>App performance data (crashes, errors)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4">How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Provide and maintain the TaxMate app functionality</li>
              <li>Calculate your home office tax deduction accurately</li>
              <li>Store your calculation history for your convenience</li>
              <li>Improve and optimize the app experience</li>
              <li>Identify and fix technical issues</li>
              <li>Communicate with you about app updates or important information</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4">Data Storage and Security</h2>
            
            <h3>Local Storage</h3>
            <p className="mb-4">
              All financial and calculation data you enter into TaxMate is stored locally on your 
              device. This means:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Your expense data and calculations remain on your device</li>
              <li>We do not store your financial information on our servers</li>
              <li>Your data is protected by your device&rsquo;s security measures</li>
              <li>If you delete the app, your local data will be removed</li>
            </ul>

            <h3>Security Measures</h3>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your 
              information, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Secure coding practices</li>
              <li>Regular security assessments</li>
              <li>Limited access to any collected analytics data</li>
            </ul>
            <p className="mb-4">
              However, no method of transmission over the internet or electronic storage is 100% 
              secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4">Third-Party Services</h2>
            <p className="mb-4">
              TaxMate may use third-party services for analytics and app performance monitoring. 
              These services may collect information used to identify you. Third-party services we 
              may use include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Apple App Store (for app distribution)</li>
              <li>Analytics services (for usage statistics and crash reporting)</li>
            </ul>
            <p className="mb-4">
              These third parties have their own privacy policies addressing how they use such information.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4">Your Rights</h2>
            <p className="mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mb-4">
              Since most data is stored locally on your device, you can delete your calculation 
              history directly within the app or by uninstalling the app.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4">Children&rsquo;s Privacy</h2>
            <p className="mb-4">
              TaxMate is not intended for use by children under the age of 18. We do not knowingly 
              collect personal information from children under 18. If you are a parent or guardian 
              and believe your child has provided us with personal information, please contact us.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4">Data Retention</h2>
            <p className="mb-4">
              We retain your information only for as long as necessary to provide you with the 
              TaxMate service and fulfill the purposes described in this Privacy Policy. Since most 
              data is stored locally on your device, you control the retention period by managing 
              your calculation history within the app.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4">International Data Transfers</h2>
            <p className="mb-4">
              Your information, including personal data, may be transferred to and maintained on 
              computers located outside of your country or governmental jurisdiction where data 
              protection laws may differ. If you are located outside the United Kingdom and choose 
              to provide information to us, please note that we transfer the data to the United Kingdom 
              and process it there.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4">Changes to This Privacy Policy</h2>
            <p className="mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
            <p className="mb-4">
              You are advised to review this Privacy Policy periodically for any changes. Changes 
              to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4">HMRC and Tax Advice Disclaimer</h2>
            <p className="mb-4">
              TaxMate is not affiliated with HMRC. This app is a calculation tool designed to help 
              you estimate your home office tax deduction based on HMRC guidance. It does not 
              constitute tax advice. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Ensuring the accuracy of the information you enter</li>
              <li>Retaining evidence of expenses claimed</li>
              <li>Complying with HMRC requirements</li>
              <li>Seeking professional tax advice if needed</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please 
              contact us at:
            </p>
            <p className="mb-4">
              Email: taxmateapp@outlook.com
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4">UK GDPR Compliance</h2>
            <p className="mb-4">
              TaxMate is committed to complying with the UK General Data Protection Regulation 
              (UK GDPR) and the Data Protection Act 2018. We process your personal data lawfully, 
              fairly, and transparently, and only for the specific purposes outlined in this policy.
            </p>
          </section>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
