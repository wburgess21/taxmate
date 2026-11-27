import { VIEW_BOX, backCoin, frontCoin, frontSilhouette } from "./paths";

/**
 * The two-coin mark with its sparkles as a standalone SVG string, in one colour. Used by the social images (server)
 * and the shareable result card (drawn in the browser), so both carry the same mark as the app.
 */
export function markSvg(fill = "#fff") {
  const { width, height } = VIEW_BOX;
  const star = (x: number, y: number, r: number) => {
    const c = 0.17 * r;
    return `M${x} ${y - r}Q${x + c} ${y - c} ${x + r} ${y}Q${x + c} ${y + c} ${x} ${y + r}Q${x - c} ${y + c} ${x - r} ${y}Q${x - c} ${y - c} ${x} ${y - r}Z`;
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><mask id="m" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="#fff"/><path d="${frontSilhouette}" fill="#000"/></mask><g fill="${fill}"><path d="${backCoin}" fill-rule="evenodd" mask="url(#m)"/><path d="${frontCoin}" fill-rule="evenodd"/><path d="${star(1210, 230, 135)}"/><path d="${star(260, 1225, 105)}"/></g></svg>`;
}

export const MARK_RATIO = VIEW_BOX.height / VIEW_BOX.width;
