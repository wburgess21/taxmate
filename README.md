# TaxMate

TaxMate is the marketing and legal website for the TaxMate iOS app: UK tax calculators for iPhone and iPad covering take-home pay, self-employed tax, combined income, home office, business expenses, mileage, pensions, tax savings, VAT, Making Tax Digital and annual summaries.

The site follows the app's design language (`taxmate-ios/Documentation/Design.md`): the canvas and surface colours, green and gold hero cards, and the three tool-group tints, in light and dark mode.

## Features

- Landing page with App Store calls to action
- The app's coin animations, ported to canvas (`lib/coins`):
  - Hero: the launch animation (coins slide together, stars pop), then tap to spin like the home logo
  - How it works: the onboarding coin stack, which grows as you scroll through the steps
  - Closing call to action: coins to hover, tap and toss
- Interactive take-home pay estimate using the app's 2026/27 bands (England, Wales & NI, and Scotland)
- Live countdown to the next HMRC key date
- Tool catalogue grouped as in the app, TaxMate Plus, privacy and FAQ sections
- Respects `prefers-reduced-motion` and `prefers-color-scheme`; animations pause off-screen
- Privacy policy at `/privacy` and terms of use at `/terms`
- Vercel Analytics integration

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
