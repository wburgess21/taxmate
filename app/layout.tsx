import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { RevealOnScroll } from "@/components/site/Reveal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Eleven UK tax calculators for iPhone and iPad: take-home pay, self-employed tax, home office, expenses, mileage, pensions, VAT, Making Tax Digital and more. Personalised to you, with live estimates and your calculations kept on your device.";

export const metadata: Metadata = {
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
    <html lang="en-GB">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <RevealOnScroll />
        <Analytics />
      </body>
    </html>
  );
}
