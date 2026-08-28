import { brandPalette } from "@/shared/brand";

export function PaletteGrid() {
  return (
    <section className="mt-20 border-t border-charcoal/15 pt-14">
      <p className="eyebrow text-earth-ink">Core palette</p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {brandPalette.map((color) => (
          <div key={color.hex}>
            <div className="aspect-square rounded-2xl border border-charcoal/10" style={{ backgroundColor: color.hex }} />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em]">{color.name}</p>
            <p className="mt-1 font-mono text-xs text-charcoal/75">{color.hex}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
