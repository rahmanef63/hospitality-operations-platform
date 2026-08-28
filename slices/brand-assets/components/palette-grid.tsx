import { brandPalette } from "@/shared/brand";

export function PaletteGrid() {
  return (
    <section className="mt-24 border-t border-charcoal/16 pt-12 lg:mt-32">
      <div className="grid gap-8 lg:grid-cols-[.55fr_1.45fr] lg:items-end">
        <p className="kicker text-umber">Core palette</p>
        <h2 className="text-balance font-serif text-5xl leading-[0.94] tracking-[-0.03em] sm:text-7xl">
          Warm neutrals, held by earth and olive.
        </h2>
      </div>
      <div className="mt-12 grid grid-cols-2 border-l border-t border-charcoal/14 sm:grid-cols-3 lg:grid-cols-6">
        {brandPalette.map((color) => (
          <article key={color.hex} className="border-b border-r border-charcoal/14 bg-paper">
            <div className="aspect-[4/5]" style={{ backgroundColor: color.hex }} aria-hidden="true" />
            <div className="p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em]">{color.name}</p>
              <p className="mt-2 font-mono text-xs text-charcoal/68">{color.hex}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
