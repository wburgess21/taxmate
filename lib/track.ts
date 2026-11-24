import { track } from "@vercel/analytics";

type Props = Record<string, string | number | boolean | null>;

/** A Vercel Analytics custom event, tagged with the page it happened on. Never throws. */
export function trackEvent(name: string, props: Props = {}) {
  try {
    track(name, { path: location.pathname, ...props });
  } catch {}
}
