import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { RevealOnScroll } from "@/components/site/Reveal";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

/**
 * Decides before first paint whether the launch intro plays, from the top of the home page. On desktop it plays once a
 * session. On phones a browser tab can last for weeks (and a reload keeps it), so there it plays whenever the page is
 * opened or reloaded, and is skipped only when coming back to it.
 */
const introScript = `try{var d=document.documentElement;d.classList.add("js");var n=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0],m=matchMedia("(max-width: 959px)").matches,again=m?!!(n&&n.type==="back_forward"):!!(sessionStorage.getItem("tm-intro")||(history.state&&history.state.__NA));if(location.pathname==="/"&&!location.hash&&!again&&!matchMedia("(prefers-reduced-motion: reduce)").matches)d.dataset.intro="1"}catch(e){}`;

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Eleven UK tax calculators for iPhone and iPad: take-home pay, self-employed tax, home office, expenses, mileage, pensions, VAT, Making Tax Digital and more. Personalised to you, with live estimates and your calculations kept on your device.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: {
    default: "TaxMate: Your UK tax, made clearer",
    template: "%s · TaxMate",
  },
  description,
  applicationName: "TaxMate",
  openGraph: {
    title: "TaxMate: Your UK tax, made clearer",
    description,
    type: "website",
    locale: "en_GB",
    siteName: "TaxMate",
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image", title: "TaxMate: Your UK tax, made clearer", description },
  appleWebApp: { title: "TaxMate" },
  itunes: { appId: "6757307991" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f3ee" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0f0c" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} font-sans antialiased`}>
        {children}
        <RevealOnScroll />
        <Analytics />
      </body>
    </html>
  );
}
