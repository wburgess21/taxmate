"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";

/** Questions that open and close smoothly (height and fade), one or several at a time. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const id = useId();
  const toggle = (i: number) => setOpen((o) => { const n = new Set(o); if (n.has(i)) n.delete(i); else n.add(i); return n; });
  return (
    <div className="border-b border-hairline">
      {items.map((f, i) => {
        const on = open.has(i);
        return (
          <div key={f.q} className="faq-item border-t border-hairline" data-open={on || undefined}>
            <h3>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium sm:text-xl"
                aria-expanded={on}
                aria-controls={`${id}-${i}`}
                onClick={() => toggle(i)}
              >
                {f.q}
                <Plus className="faq-plus h-5 w-5 flex-none text-muted" aria-hidden />
              </button>
            </h3>
            <div id={`${id}-${i}`} role="region" className="faq-panel" aria-hidden={!on}>
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-7 leading-relaxed text-muted">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
