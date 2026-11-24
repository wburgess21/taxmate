import { Star } from "lucide-react";
import { appRating } from "@/lib/appStore";

/** "★ 4.8 · 120 ratings on the App Store", or nothing until there are enough real ratings. */
export async function AppRating({ className = "" }: { className?: string }) {
  const r = await appRating();
  if (!r) return null;
  return (
    <p className={`inline-flex items-center gap-2 text-[0.875rem] ${className}`}>
      <span className="inline-flex items-center gap-1 font-medium">
        <Star className="h-4 w-4 fill-current text-gold" aria-hidden />
        {r.value.toFixed(1)}
      </span>
      <span className="opacity-70">from {r.count.toLocaleString("en-GB")} ratings on the App Store</span>
    </p>
  );
}
