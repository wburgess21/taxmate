# TaxMate

TaxMate is the marketing and legal website for the TaxMate iOS app: UK tax calculators for iPhone and iPad covering take-home pay, self-employed tax, combined income, home office, business expenses, mileage, pensions, tax savings, VAT, Making Tax Digital and annual summaries.

The site follows the app's design language (`taxmate-ios/Documentation/Design.md`): the canvas and surface colours, green and gold hero cards, and the three tool-group tints, in light and dark mode.

Setup tasks and open questions for the site owner are in [TODO.md](TODO.md).

## Features

**Pages**

| Path | What it is |
| --- | --- |
| `/` | The home page: a scroll-driven tour of the app's first run, a salary splitter, the tools, key dates, privacy, TaxMate Plus and FAQs |
| `/calculators` and `/calculators/<name>` | Ten free web calculators (see below) |
| `/tax-rates` | Every 2026/27 rate and threshold, built from `lib/taxRules.ts` |
| `/key-dates` and `/key-dates.ics` | HMRC deadlines for the next 12 months, filterable by who they apply to, and a subscribable iCalendar feed with a reminder a week before each date |
| `/for` and `/for/<audience>` | Guides for employees, sole traders, side hustles, landlords and company directors |
| `/blog`, `/blog/<slug>`, `/blog/category/<slug>`, `/blog/rss.xml` | The Sanity-powered blog and its feed |
| `/privacy`, `/terms` | Legal pages |

**The home page** is told with the app's own coins (`lib/coins` is a canvas port of the iOS coin renderer and spring physics, with cut-out holes so coins can sit over anything):

- **Story** (`components/story`): a pinned, scroll-driven sequence. It opens with the launch animation, then the green floods out and the hero shrinks into an HTML iPhone. Onboarding questions follow (answers land on coins, the stack grows, goals orbit as satellites), then the personalising loader, the coins landing in the home logo, a live estimate and the result sheet. App screens are built at native point sizes from the app's `Design.md`.
- **Your pay, in coins**: drag a salary and watch it split into piles of £1,000 coins.
- **Tools**: the eleven tools in their three tinted groups; each row links to its web calculator.
- **Key dates**, privacy, **TaxMate Plus** (`/#plus` lands on the card), FAQs with links to the guides, and a closing coin heap to play with.

**Across the site**

- A floating nav with a menu on phones (`components/site/MobileMenu.tsx`, Radix Dialog).
- Light and dark mode follow the system. Animations respect `prefers-reduced-motion` and pause off-screen.
- Scroll-in reveals (`components/site/Reveal.tsx`) rescan on every client-side navigation. `components/site/HashScroll.tsx` re-aligns `#anchor` links once the layout settles.
- The live App Store rating (`lib/appStore.ts`) appears under the hero and on app cards once there are at least five ratings.
- Security headers and a strict Content Security Policy (`next.config.ts`).

## Calculators

`/calculators` and ten free calculator pages (`/calculators/take-home-pay`, `/calculators/vat` and so on), one for each app tool that works as a quick estimate. Each page has the interactive calculator, an explanation, server-rendered worked figures where useful, FAQs (as FAQPage structured data), related calculators and a call to action into the matching app tool.

- `lib/taxRules.ts`: every 2026/27 rate and threshold, and the calculations. **Update this file each tax year**, checking it against the app's `TaxRules.swift` and GOV.UK.
- `tests/taxRules.test.ts`: the app's own worked examples (`taxmate-ios/Documentation/TaxRules`), run with `npm test`. Add the app's new fixtures here each tax year.
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

## Search, agents and browsers

- **Structured data** (schema.org JSON-LD, `lib/schema.ts` and `lib/calcSchema.ts`): Organization, WebSite and MobileApplication (with the live rating once there is one) on every page; BreadcrumbList on inner pages; WebApplication and FAQPage on calculators; ItemList on `/calculators`; Article on `/tax-rates`; FAQPage on the home page and guides; BlogPosting and FAQPage on posts.
- **`/llms.txt`** (`lib/llms.ts`): TaxMate in plain Markdown for language models and agents. It covers what the app and site are, the 2026/27 key figures as quotable lines, the app's tools, Plus, FAQs, and links to every calculator, guide, reference page, feed and post.
- **`/llms-full.txt`**: the full text of every calculator explanation and FAQ, the guides, the key figures and the yearly calendar in one file, so agents can answer without running the JavaScript calculators.
- **`/robots.txt`**: open to all crawlers, including AI crawlers, except `/api/`. **`/sitemap.xml`** lists every page and post, with last-modified dates from `RULES.checked` and Sanity.
- **`/manifest.webmanifest`**: name, icons, colours, shortcuts, and the App Store app as a related application.
- Calculator inputs live in the address bar (`/calculators/take-home-pay?salary=45000&region=scotland`), so agents and people can link straight to a result.
- Everything in these files is generated from the same data as the pages (`lib/taxRules.ts`, `lib/calculators.ts`, `lib/audiences.ts`, `lib/keyDates.ts`, `lib/tools.ts`, `lib/content.ts`), so it can't drift.

## Tech Stack

- [Next.js](https://nextjs.org/) 16 with the App Router
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) 4
- [Lucide React](https://lucide.dev/) icons
- [Vercel Analytics](https://vercel.com/analytics)
- [Sanity](https://www.sanity.io/) for the blog, with [Radix](https://www.radix-ui.com/) Dialog for the phone menu

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

```bash
npm test
```

Checks the tax engine against the app's own worked examples (`tests/taxRules.test.ts`).

## Project Structure

```text
app/                    Routes: home, calculators, tax-rates, key-dates (+ .ics), for, blog (+ rss.xml),
                        privacy, terms, llms.txt, llms-full.txt, sitemap, robots, manifest, api/revalidate
components/blog/        Post body (Portable Text), cards, categories, images from Sanity's CDN
components/calculators/ The ten interactive calculators and their shared fields
components/sections/    Home page sections (salary splitter, tools, timeline, Plus coin, FAQ, coin heap)
components/site/        Nav and phone menu, footer, page frame, app call to action, structured data, trackers
components/story/       The home page's scroll-driven tour
lib/                    Tax rules, page content, structured data, llms.txt, Sanity client, coins engine
studio/                 Sanity Studio (its own package)
tests/                  Tax engine tests against the app's fixtures
```

## Key Files

- `lib/taxRules.ts`: every 2026/27 figure and calculation, and `RULES.checked`, the date they were last checked.
- `lib/calculators.ts`, `lib/audiences.ts`, `lib/keyDates.ts`, `lib/content.ts`: the copy and data behind the pages, structured data and llms files.
- `lib/site.ts`: the site URL, App Store link and `appStoreUrl()` campaign helper.
- `app/layout.tsx`: default metadata, fonts, site-wide structured data, analytics and the scroll helpers.
- `app/globals.css`: Tailwind theme tokens and component styles.

## Styling Notes

The project uses Tailwind CSS v4 with CSS variables in `app/globals.css`. Path aliases such as `@/components` and `@/lib` are configured in `tsconfig.json`.

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
