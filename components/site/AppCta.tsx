import { Check } from "lucide-react";
import { AppStoreButton } from "./AppStoreButton";
import { AppQr } from "./AppQr";

/**
 * The green "do more in the app" card for inner pages. On wide screens it offers a code to scan, since most desktop
 * visitors install on their phone.
 */
export function AppCta({ title, body, points, placement }: { title: [string, string]; body: string; points?: string[]; placement: string }) {
  return (
    <section className="px-3 pb-4 pt-16 sm:px-6 lg:pb-6 lg:pt-24">
      <div className="green mx-auto grid max-w-[1240px] items-center gap-12 overflow-hidden rounded-[36px] px-7 py-12 sm:px-14 sm:py-16 lg:grid-cols-[1fr_auto] lg:px-20" data-reveal>
        <div>
          <p className="eyebrow text-gold">Free on the App Store</p>
          <h2 className="display mt-4 text-[2.5rem] sm:text-6xl">{title[0]} <em className="text-gold">{title[1]}</em></h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">{body}</p>
          {points && (
            <ul className="mt-7 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {points.map((p) => (
                <li key={p} className="flex gap-3 text-white/85"><Check className="mt-1 h-4 w-4 flex-none text-gold" strokeWidth={2.6} aria-hidden />{p}</li>
              ))}
            </ul>
          )}
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <AppStoreButton variant="gold" label="Get TaxMate" placement={placement} />
            <span className="text-[0.875rem] text-white/60">Free estimates. Plus is a one-time purchase.</span>
          </div>
        </div>
        <div className="hidden flex-col items-center lg:flex">
          <div className="get-app-qr"><AppQr campaign={`${placement}-qr`} className="block h-[148px] w-[148px]" /></div>
          <p className="mt-4 text-[0.9375rem] text-white/70">Scan with your iPhone</p>
        </div>
      </div>
    </section>
  );
}
