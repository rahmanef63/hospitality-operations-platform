import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { BrandLockup } from "@/shared/brand";
import type { PropertyContent } from "@/shared/content";

export function PropertyEnquiry({ property }: { property: PropertyContent }) {
  return (
    <section className="scroll-parallax-section relative isolate min-h-[42rem] overflow-hidden bg-charcoal text-ivory">
      <Image src={property.enquiryImage.src} alt={property.enquiryImage.alt} fill sizes="100vw" className="scroll-parallax-bg -z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-charcoal/66" />

      <div className="page-shell content-inset flex min-h-[42rem] flex-col justify-between py-14 sm:py-18 lg:py-20">
        <BrandLockup kind="property" compact inverse />
        <div className="scroll-reveal max-w-4xl">
          <h2 className="text-balance font-serif text-6xl leading-[0.88] tracking-[-0.04em] sm:text-8xl lg:text-9xl">
            Your time remains yours.
          </h2>
          <p className="mt-7 max-w-xl text-base leading-8 text-ivory">
            Tell us what you are planning and how you would like the stay to feel. We will take care of the next steps.
          </p>
          <a href={property.primaryAction.href} className="cta-solid cta-solid-light mt-9">
            {property.primaryAction.label}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
        <p className="image-caption mt-10 max-w-sm text-ivory/72">{property.visualNote}</p>
      </div>
    </section>
  );
}
