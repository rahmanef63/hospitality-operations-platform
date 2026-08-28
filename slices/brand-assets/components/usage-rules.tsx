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
      <div className="grid gap-14 p-8 sm:p-12 lg:grid-cols-[.58fr_1.42fr] lg:gap-20 lg:p-16">
        <div className="flex flex-col justify-between">
          <p className="kicker text-warm-sand">Identity rule</p>
          <BotanicalMark className="mt-16 size-20 text-warm-sand/72" />
        </div>
        <div>
          <h2 className="text-balance font-serif text-6xl leading-[0.9] tracking-[-0.04em] sm:text-8xl">
            One identity. Many places.
          </h2>
          <div className="mt-12 border-y border-ivory/15">
            {rules.map((rule, index) => (
              <div key={rule} className="grid gap-5 border-b border-ivory/15 py-7 last:border-b-0 sm:grid-cols-[4rem_1fr] sm:py-9">
                <span className="font-serif text-3xl text-warm-sand/55">0{index + 1}</span>
                <p className="max-w-2xl text-sm leading-7 text-ivory/68 sm:text-base sm:leading-8">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
