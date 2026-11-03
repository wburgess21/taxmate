import type { Block } from "@/lib/calculators";

/** Explanatory blocks as prose. */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-tm">
      {blocks.map((b) => (
        <section key={b.h} className="mt-12 first:mt-0">
          <h2>{b.h}</h2>
          {b.p?.map((p) => <p key={p} className="mt-4">{p}</p>)}
          {b.ul && <ul className="mt-4">{b.ul.map((li) => <li key={li}>{li}</li>)}</ul>}
        </section>
      ))}
    </div>
  );
}
