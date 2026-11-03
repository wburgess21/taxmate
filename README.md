# TaxMate

TaxMate is the marketing and legal website for the TaxMate iOS app: UK tax calculators for iPhone and iPad covering take-home pay, self-employed tax, combined income, home office, business expenses, mileage, pensions, tax savings, VAT, Making Tax Digital and annual summaries.

The site follows the app's design language (`taxmate-ios/Documentation/Design.md`): the canvas and surface colours, green and gold hero cards, and the three tool-group tints, in light and dark mode.

## Features

The home page is a tour of the app's first run, told with the app's own coins (`lib/coins` is a canvas port of the iOS coin renderer and spring physics, with cut-out holes so coins can sit over anything):

- **Story** (`components/story`): a pinned, scroll-driven sequence. It opens with the launch animation (once a session), then the green floods out and the hero shrinks into an HTML iPhone. Onboarding questions follow (answers land on coins, the stack grows, goals orbit as satellites), then the personalising loader, the coins landing in the home logo, a live estimate and the result sheet. App screens are built at native point sizes from the app's `Design.md`.
- **Your pay, in coins**: drag a salary and watch it split into piles of £1,000 coins (2026/27 bands, England, Wales & NI or Scotland).
- **Tools**: the eleven tools in their three tinted groups, each with a coin badge that flips on hover.
- **Key dates**: the current tax year with a coin rolling to today and a live countdown to the next HMRC date.
- Privacy, TaxMate Plus, FAQ and a closing coin heap to play with.
- Light and dark mode follow the system; animations respect `prefers-reduced-motion` and pause off-screen.
- Privacy policy at `/privacy` and terms of use at `/terms`
- Canonical URLs, sitemap, robots and a generated share image for https://www.taxmate-app.com
- Vercel Analytics integration

## Calculators

`/calculators` and ten free calculator pages (`/calculators/take-home-pay`, `/calculators/vat` and so on), one for each app tool that works as a quick estimate. Each page has the interactive calculator, an explanation, server-rendered worked figures where useful, FAQs (as FAQPage structured data), related calculators and a call to action into the matching app tool.

- `lib/taxRules.ts`: every 2026/27 rate and threshold, and the calculations. **Update this file each tax year**, checking it against the app's `TaxRules.swift` and GOV.UK.
- `lib/calculators.ts`: each page's copy, FAQ and what the app adds.
- `components/calculators`: the interactive calculators. Inputs are mirrored in the address bar (`?salary=45000`), so results can be shared.

## Blog (Sanity)

Posts are written in Sanity and published at `/blog`, with category pages, an RSS feed at `/blog/rss.xml`, BlogPosting and FAQ structured data, and entries in the sitemap and `llms.txt`. Until a Sanity project is connected the blog shows a "coming soon" page (kept out of search), so the site builds and runs without it.

**The Studio** lives in `studio/`, with its own dependencies:

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage) and note its project ID.
2. `cd studio && cp .env.example .env`, set `SANITY_STUDIO_PROJECT_ID`, then `npm install` and `npm run dev` to write locally, or `npm run deploy` to host it at https://taxmate.sanity.studio.
3. In the project's API settings, add `https://www.taxmate-app.com` and `http://localhost:3333` as CORS origins.

**The site** needs, in Vercel:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` (usually `production`).
- `SANITY_REVALIDATE_SECRET`, any long random string. In Sanity → API → Webhooks, add a webhook for `post`, `category` and `author` documents on create, update and delete, sending `POST https://www.taxmate-app.com/api/revalidate` with the header `Authorization: Bearer <secret>`. New posts then go live at once; without it, pages refresh within an hour.

Each post has a title, slug, excerpt, category, author, dates, the tax year it covers, an image, a body (headings, lists, links, images, callouts and calculator cards), questions (published as FAQ structured data), up to three related calculators, and search title, description and noindex settings.

## Measurement

- Every App Store link carries a campaign (`ct`), such as `home-hero`, `nav` or `home-finale-qr`, built by `appStoreUrl()` in `lib/site.ts`. Set `NEXT_PUBLIC_APP_STORE_PROVIDER_TOKEN` (App Store Connect → Analytics → Campaigns) and installs from each placement show up under Sources in App Store Connect. QR codes carry their own campaign, since scans never touch the site.
- Clicks on anything marked `data-cta` are sent to Vercel Analytics as an `App Store click` event with the placement and page (`components/site/ClickTracker.tsx`). Switching the closing call to action to its QR code sends `QR shown`. Custom events need a Vercel Pro plan.
- `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` add the Search Console and Bing Webmaster Tools meta tags. Submit `/sitemap.xml` in both.
- See `.env.example` for every variable.

## Search and agents

- schema.org JSON-LD (`lib/schema.ts`): Organization, WebSite and MobileApplication on every page, FAQPage on the home page.
- `/llms.txt` (`lib/llms.ts`) describes TaxMate in plain Markdown for language models and agents, built from the same data as the pages (`lib/tools.ts`, `lib/content.ts`).

## Tech Stack

- [Next.js](https://nextjs.org/) 16 with the App Router
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- shadcn-style UI primitives in `components/ui`
- [Lucide React](https://lucide.dev/) icons
- [Vercel Analytics](https://vercel.com/analytics)

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Runs the production build locally. Run `npm run build` first.

```bash
npm run lint
```

Runs ESLint using the Next.js core web vitals and TypeScript rules.

## Project Structure

```text
app/
  globals.css        Global Tailwind CSS theme and base styles
  layout.tsx         Root layout, metadata, fonts, and analytics
  page.tsx           Main TaxMate landing page
  privacy/page.tsx   Privacy policy route
  terms/page.tsx     Terms of use route
components/ui/       Reusable UI primitives
lib/utils.ts         Shared class name helper
public/              Static assets, including logo and hero image
```

## Key Files

- `app/page.tsx` contains the main marketing page content and App Store links.
- `app/layout.tsx` defines the default metadata, Geist fonts, viewport settings, and Vercel Analytics.
- `app/privacy/page.tsx` contains the hosted privacy policy.
- `app/terms/page.tsx` links to Apple's standard EULA.
- `app/globals.css` defines the Tailwind theme tokens and app-wide base styles.

## Styling Notes

The project uses Tailwind CSS v4 with CSS variables in `app/globals.css`. UI components follow the shadcn `new-york` style configuration from `components.json`, with aliases such as `@/components` and `@/lib` configured in `tsconfig.json`.

The primary brand color used throughout the site is `#005424`.

## Deployment

This app is ready to deploy on Vercel or any platform that supports Next.js.

For Vercel, connect the repository and use the default Next.js build settings:

- Build command: `npm run build`
- Output: managed by Next.js
- Install command: `npm install`

## License

This repository is source-available for viewing and reference only. Reuse, modification, redistribution, or use in other projects is not permitted without prior written permission.

See [LICENSE](./LICENSE) for details.
