# Your to-do list

Things only you can do (accounts, settings, content and decisions) to get the most from the marketing work on this site. Claude updates this list as changes land: tick items off as you go, and anything new is added at the top of its section.

_Last updated: 4 November 2026_

## 1. Before you merge

- [ ] **On your iPhone in Safari, scroll down from the top of a few pages and check the header stays visible.** Claude couldn't reproduce the disappearing header in Chrome and has applied the standard Safari fix. If it still happens, send a screenshot and your iOS version.
- [ ] Look over the Vercel preview of this branch, on your phone as well as desktop: home page, `/calculators`, a calculator or two, `/tax-rates`, `/key-dates`, `/for/landlords`, `/blog` and the phone menu.
- [ ] Merge the pull request (ask Claude to open one when you're ready).

## 2. Measurement (about 20 minutes)

- [ ] **App Store campaign token.** In App Store Connect, open Analytics for TaxMate and find the campaign link generator (under Acquisition or Sources → Campaigns, depending on the layout). Copy the `pt=` value into Vercel → Settings → Environment Variables as `NEXT_PUBLIC_APP_STORE_PROVIDER_TOKEN`, then redeploy. Installs by button (`home-hero`, `calc-vat-result`, `mobile-menu`, and so on) then appear under Sources in App Store Connect after a day or two.
- [ ] **Vercel Analytics events.** You're on Pro, so custom events work. After deploying, check Vercel → Analytics → Events for `App Store click` (with `placement` and `path`) and `QR shown`.
- [ ] **Google Search Console.** Add `https://www.taxmate-app.com` as a property and choose the HTML tag method. Put the `content="…"` value in Vercel as `GOOGLE_SITE_VERIFICATION`, redeploy, click Verify, then submit `https://www.taxmate-app.com/sitemap.xml`.
- [ ] **Bing Webmaster Tools** (Bing also powers Copilot and ChatGPT search). Import from Search Console, or use the meta tag and set `BING_SITE_VERIFICATION`. Submit the sitemap there too.
- [ ] Optional: turn on **Vercel Speed Insights** to track Core Web Vitals on the new pages.

## 3. Blog (about 30 minutes, then ongoing)

The full steps are in the README under "Blog (Sanity)".

- [ ] Create a Sanity project at [sanity.io/manage](https://www.sanity.io/manage) and note the project ID.
- [ ] Deploy the Studio: `cd studio`, copy `.env.example` to `.env`, set `SANITY_STUDIO_PROJECT_ID`, then run `npm install` and `npm run deploy`. It will live at https://taxmate.sanity.studio.
- [ ] In Sanity → API → CORS origins, add `https://www.taxmate-app.com` and `http://localhost:3333`.
- [ ] In Vercel, set `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` (`production`) and `SANITY_REVALIDATE_SECRET` (any long random string), then redeploy.
- [ ] In Sanity → API → Webhooks, add one for `post`, `category` and `author` (create, update, delete) that sends `POST https://www.taxmate-app.com/api/revalidate` with the header `Authorization: Bearer <your secret>`.
- [ ] Create an author (you) and three or four categories, for example: Employees, Self-employed, Landlords, Pensions, Deadlines.
- [ ] Write the first posts. Each should link to a calculator and set "Related calculators". Ideas that match what people search for:
  - How much tax will I pay on £30,000 / £40,000 / £50,000? (Employed and self-employed versions.)
  - The £100,000 tax trap, and how pension contributions get you out of it.
  - Payments on account: why your second January bill is so big.
  - Making Tax Digital for sole traders and landlords: what changes in April 2027 (the £30,000 threshold).
  - Mileage went up to 55p: what sole traders can claim in 2026/27.
  - Selling on Vinted, eBay or Etsy: when HMRC needs to know.
  - Working from home: what employees lost in April 2026, and what the self-employed can still claim.
  - Self Assessment by 31 January: a checklist.

## 4. App Store and other channels

- [ ] In App Store Connect, set the app's **Marketing URL** to `https://www.taxmate-app.com` and the **Support URL** to a page on the site.
- [ ] Ask happy users for ratings (for example with `SKStoreReviewController` after a successful calculation). The site shows the live rating automatically once there are at least five.
- [ ] Link to `/calculators` and `/key-dates` from your social profiles, and share the calendar feed (`/key-dates.ics`) in a post before 31 January.

## 5. Check these facts

The calculators match the app's rules and pass its own worked examples (`npm test`). The extra facts were checked on 4 November 2026 against the GOV.UK policy paper, LITRG and CIPP: 55p mileage for employees as well as sole traders, the end of employee working-from-home relief from 6 April 2026, dividend rates of 10.75%, 35.75% and 39.35%, property income rates of 22%, 42% and 47% from April 2027, and thresholds frozen until April 2031. One is left:

- [ ] **Bicycles (20p a mile)** for employee mileage. It isn't in the app, and no source confirmed it for 2026/27. Check GOV.UK's "Expenses and benefits: business travel mileage" page.
- [ ] Optional: let this cloud environment reach `www.gov.uk` (environment settings, network access), so Claude can read GOV.UK pages directly next time.

## 6. Every new tax year (each spring)

- [ ] Update `lib/taxRules.ts` alongside the app's `TaxRules.swift`, add the app's new worked examples to `tests/taxRules.test.ts`, and run `npm test`.
- [ ] Update the "Last checked" date on `/tax-rates` (`UPDATED` in `app/tax-rates/page.tsx`) and `TAX_YEAR` in `lib/site.ts`.
- [ ] Refresh blog posts that quote figures, and set their "Updated" date in Sanity.

## Done

- [x] Checked the remaining facts against official and trusted sources (4 November 2026).
- [x] Gave Claude access to the iOS repo, so the web calculators could be checked against the app (4 November 2026).
