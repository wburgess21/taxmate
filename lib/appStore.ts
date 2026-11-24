import { APP_STORE_ID } from "./site";
import type { Rating } from "./schema";

/** Below this many ratings an average says little, so nothing is shown. */
export const MIN_RATINGS = 5;

/**
 * The app's live App Store rating for the UK store, from Apple's public lookup API, refreshed daily. Returns null when
 * there aren't enough ratings yet or Apple can't be reached, so pages never show a made-up or stale figure.
 */
export async function appRating(): Promise<Rating | null> {
  try {
    const res = await fetch(`https://itunes.apple.com/lookup?id=${APP_STORE_ID}&country=gb`, {
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    const r = (await res.json())?.results?.[0];
    const value = Number(r?.averageUserRating), count = Number(r?.userRatingCount);
    if (!Number.isFinite(value) || !Number.isFinite(count) || count < MIN_RATINGS || value <= 0) return null;
    return { value, count };
  } catch {
    return null;
  }
}
