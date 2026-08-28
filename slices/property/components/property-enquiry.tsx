import Image from "next/image";
import { ArrowUpRight, Mail, MapPin, MessageCircle } from "lucide-react";
import { BrandLockup } from "@/shared/brand";
import type { PropertyContent } from "@/shared/content";

export function PropertyEnquiry({ property }: { property: PropertyContent }) {
  return (
    <section className="scroll-parallax-section relative isolate min-h-[42rem] overflow-hidden bg-charcoal text-ivory">
      <Image src={property.enquiryImage.src} alt={property.enquiryImage.alt} fill sizes="100vw" className="scroll-parallax-bg -z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-charcoal/70" />

      <div className="page-shell content-inset flex min-h-[42rem] flex-col justify-between py-14 sm:py-18 lg:py-20">
        <BrandLockup kind="property" compact inverse />
        <div className="scroll-reveal max-w-4xl">
          <h2 className="text-balance font-serif text-6xl leading-[0.88] tracking-[-0.04em] sm:text-8xl lg:text-9xl">
            Your time remains yours.
          </h2>
          <p className="mt-7 max-w-xl text-base leading-8 text-ivory">
            Tell us what you are planning and how you would like the stay to feel. We will take care of the next steps.
          </p>
          <div className="mt-8 flex items-start gap-3 border-t border-ivory/20 pt-7 text-sm leading-7 text-ivory/82">
            <MapPin className="mt-1 size-4 shrink-0 text-warm-sand" aria-hidden="true" />
            <address className="not-italic">{property.location.displayAddress}</address>
          </div>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href={property.primaryAction.href} className="cta-solid cta-solid-light">
              <Mail className="size-4" aria-hidden="true" />
              {property.primaryAction.label}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
            {property.contact.whatsappHref ? (
              <a
                href={property.contact.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="cta-outline border-ivory/70 text-ivory hover:border-ivory"
              >
                <MessageCircle className="size-4" aria-hidden="true" />
                WhatsApp Ruma Kamyna
              </a>
            ) : null}
          </div>
        </div>
        <p className="image-caption mt-10 max-w-sm text-ivory/72">{property.visualNote}</p>
      </div>
    </section>
  );
}
