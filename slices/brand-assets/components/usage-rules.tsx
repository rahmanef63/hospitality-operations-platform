import { BotanicalMark } from "@/shared/brand";

const rules = [
  "Keep every core logo and master asset free from property locations.",
  "Use Kamyna Living for collection-level communication and Ruma Kamyna for the property experience.",
  "Preserve generous clear space around the wordmark; do not crowd it with contact details or descriptors.",
  "Do not redraw, stretch, rotate, outline, or add effects to the identity marks.",
];

export function UsageRules() {
  return (
    <section className="mt-24 border-y border-ivory/12 bg-charcoal text-ivory lg:mt-32">
      <div className="grid gap-14 lg:grid-cols-[.58fr_1.42fr] lg:gap-20 lg:p-16">
        <div className="content-inset scroll-reveal scroll-reveal-left flex flex-col justify-between py-10 lg:py-0">
          <p className="text-sm font-semibold text-warm-sand">Identity rule</p>
          <BotanicalMark className="mt-16 size-20 text-warm-sand/72" />
        </div>
        <div className="content-inset scroll-reveal scroll-reveal-right pb-10 lg:pb-0">
          <h2 className="text-balance font-serif text-6xl leading-[0.9] tracking-[-0.04em] sm:text-8xl">
            One identity. Many places.
          </h2>
          <div className="mt-12 border-y border-ivory/15">
            {rules.map((rule) => (
              <p key={rule} className="max-w-2xl border-b border-ivory/15 py-7 text-sm leading-7 text-ivory/72 last:border-b-0 sm:py-9 sm:text-base sm:leading-8">
                {rule}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
