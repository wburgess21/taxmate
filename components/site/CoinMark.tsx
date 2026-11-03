import { VIEW_BOX, backCoin, frontCoin, frontSilhouette } from "@/lib/coins/paths";

/** The app's two-coin mark (the launch artwork), drawn in the current text colour. */
export function CoinMark({ className, title }: { className?: string; title?: string }) {
  const id = "coin-mark-knockout";
  return (
    <svg
      viewBox={`0 0 ${VIEW_BOX.width} ${VIEW_BOX.height}`}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="currentColor"
    >
      <defs>
        {/* The front coin hides the back coin behind it. */}
        <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width={VIEW_BOX.width} height={VIEW_BOX.height}>
          <rect width={VIEW_BOX.width} height={VIEW_BOX.height} fill="#fff" />
          <path d={frontSilhouette} fill="#000" />
        </mask>
      </defs>
      <path d={backCoin} fillRule="evenodd" mask={`url(#${id})`} />
      <path d={frontCoin} fillRule="evenodd" />
    </svg>
  );
}
