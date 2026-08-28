import { BotanicalMark } from "@/shared/brand";

const rules = [
  "Keep every core logo and master asset free from property locations.",
  "Use Kamyna Living for collection-level communication and Ruma Kamyna for the property experience.",
  "Preserve generous clear space around the wordmark; do not crowd it with contact details or descriptors.",
  "Do not redraw, stretch, rotate, outline, or add effects to the identity marks.",
];

export function UsageRules() {
  return (
    <section className="mt-20 grid gap-12 rounded-[2rem] bg-charcoal p-8 text-ivory sm:p-12 lg:grid-cols-[.65fr_1.35fr] lg:p-16">
      <div>
        <p className="eyebrow text-warm-sand">Identity rule</p>
        <BotanicalMark className="mt-10 size-20 text-warm-sand/75" />
      </div>
      <div>
        <h2 className="text-balance font-serif text-5xl leading-none sm:text-7xl">One identity. Many places.</h2>
        <div className="mt-10 divide-y divide-ivory/15 border-y border-ivory/15">
          {rules.map((rule, index) => (
            <div key={rule} className="grid gap-4 py-6 sm:grid-cols-[3rem_1fr]">
              <span className="text-xs text-warm-sand/75">0{index + 1}</span>
              <p className="text-sm leading-7 text-ivory/65">{rule}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
