import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Shown while there are no posts yet (or Sanity isn't connected): points to the pages that do exist. */
export function BlogEmpty() {
  const links: [string, string, string][] = [
    ["/calculators", "Free calculators", "Take-home pay, self-employed tax, VAT and more."],
    ["/tax-rates", "Tax rates for this year", "Every rate and threshold on one page."],
    ["/key-dates", "Key dates", "Every HMRC deadline, in your calendar."],
  ];
  return (
    <div className="surface-card p-7 sm:p-10">
      <p className="text-xl font-light tracking-tight">The first guides are on their way.</p>
      <p className="mt-2 text-muted">In the meantime, these are a good place to start.</p>
      <ul className="mt-7 grid gap-3 sm:grid-cols-3">
        {links.map(([href, title, body]) => (
          <li key={href}>
            <Link href={href} className="surface-card link-card h-full !bg-canvas">
              <span className="font-medium">{title}</span>
              <span className="text-[0.9375rem] text-muted">{body}</span>
              <ArrowRight className="link-card-arrow mt-auto h-4 w-4 text-accent" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
