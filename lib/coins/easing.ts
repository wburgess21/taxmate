/** CSS-style cubic-bezier timing curve: maps progress x in 0…1 to eased y (y may overshoot). */
export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x, d = dx(t);
      if (Math.abs(e) < 1e-5 || Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    return sy(Math.min(Math.max(t, 0), 1));
  };
}

/** Piecewise keyframes: [value, duration, curve?] segments from a start value, sampled at time t. */
export function keyframes(start: number, segments: [number, number, ((x: number) => number)?][]) {
  return (t: number) => {
    let from = start, at = 0;
    for (const [to, duration, curve] of segments) {
      if (t < at + duration) {
        const x = (t - at) / duration;
        return from + (to - from) * (curve ? curve(x) : x);
      }
      from = to;
      at += duration;
    }
    return from;
  };
}
