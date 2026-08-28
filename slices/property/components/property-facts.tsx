import { Bath, BedDouble, Dumbbell, House, Mountain, Waves } from "lucide-react";
import type { PublicAmenity, PublicPropertyFacts } from "@/shared/pms";

const amenityIcons = {
  "swimming-pool": Waves,
  gym: Dumbbell,
  jacuzzi: Bath,
  "mountain-view": Mountain,
} as const;

function AmenityItem({ amenity }: { amenity: PublicAmenity }) {
  const Icon = amenityIcons[amenity.key as keyof typeof amenityIcons] ?? House;
  return (
    <li className="flex min-h-44 flex-col justify-between border-b border-charcoal/16 p-6 last:border-b-0 sm:p-8 lg:border-r lg:border-b-0 lg:last:border-r-0">
      <Icon className="size-6 text-olive" aria-hidden="true" />
      <div className="mt-12">
        <p className="font-serif text-3xl leading-none">{amenity.name}</p>
        {amenity.description ? <p className="mt-4 text-sm leading-7 text-ink-soft">{amenity.description}</p> : null}
      </div>
    </li>
  );
}

export function PropertyFacts({ facts }: { facts: PublicPropertyFacts }) {
  const bedroomLabel = facts.bedroomCount
    ? `${facts.bedroomCount} ${facts.bedroomCount === 1 ? "bedroom" : "bedrooms"}`
    : null;
  return (
    <section className="section-pad-compact bg-paper" aria-labelledby="property-facts-title">
      <div className="page-shell">
        <div className="content-inset grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
          <div>
            <p className="kicker text-umber">At a glance</p>
            <h2 id="property-facts-title" className="mt-6 font-serif text-6xl leading-[.9] tracking-[-.04em] sm:text-8xl">
              The essentials, clearly stated.
            </h2>
          </div>
          <div className="lg:pb-2">
            {facts.publicSummary ? <p className="max-w-2xl text-base leading-8 text-ink-soft">{facts.publicSummary}</p> : null}
            {bedroomLabel ? (
              <p className="mt-7 inline-flex min-h-12 items-center gap-3 border-y border-charcoal/18 py-3 text-sm font-semibold tracking-[.08em] uppercase">
                <BedDouble className="size-5 text-olive" aria-hidden="true" />
                {bedroomLabel}
              </p>
            ) : null}
          </div>
        </div>
        {facts.amenities.length ? (
          <ul className="mt-12 grid border-y border-charcoal/16 bg-ivory lg:grid-cols-4">
            {facts.amenities.map((amenity) => <AmenityItem key={amenity.key} amenity={amenity} />)}
          </ul>
        ) : null}
        {facts.units.length ? (
          <div className="content-inset mt-10 border-t border-charcoal/16 pt-8">
            <p className="kicker text-umber">Bookable units</p>
            <ul className="mt-5 flex flex-wrap gap-3">
              {facts.units.map((unit) => (
                <li key={unit.id} className="border border-charcoal/18 bg-paper px-4 py-3 text-sm">
                  {unit.name}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
