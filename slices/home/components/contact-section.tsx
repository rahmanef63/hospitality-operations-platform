import Image from "next/image";
import { Mail, MapPin, MessageCircle } from "lucide-react";
import type { HomeContent, PropertyContent } from "@/shared/content";

type ContactSectionProps = {
  content: HomeContent["contact"];
  property?: PropertyContent;
};

export function ContactSection({ content, property }: ContactSectionProps) {
  const whatsappHref = property?.contact.whatsappHref;
  const mapEmbedUrl = property?.location.mapEmbedUrl;

  return (
    <section id="contact" className="section-pad bg-ivory">
      <div className="page-shell grid overflow-hidden border-y border-charcoal/12 lg:grid-cols-[1.2fr_.8fr] lg:border">
        <figure className="scroll-media image-frame min-h-[24rem] lg:min-h-[40rem]">
          <Image
            src={content.image.src}
            alt={content.image.alt}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        </figure>

        <div className="scroll-reveal scroll-reveal-right flex flex-col justify-between bg-[#56604d] p-8 text-ivory sm:p-12 lg:p-14">
          <span className="font-serif text-4xl text-ivory/75">K</span>
          <div className="mt-20 lg:mt-0">
            <h2 className="text-balance font-serif text-6xl leading-[0.88] tracking-[-0.035em] sm:text-7xl">
              {content.title}
            </h2>
            <p className="mt-7 max-w-lg text-sm leading-7 text-ivory sm:text-base">{content.description}</p>

            {property ? (
              <div className="mt-8 border-t border-ivory/20 pt-7">
                <p className="kicker text-ivory">{content.locationLabel}</p>
                <address className="mt-4 max-w-md not-italic text-sm leading-7 text-ivory">
                  {property.location.displayAddress}
                </address>
              </div>
            ) : null}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={content.action.href} className="cta-solid cta-solid-light">
                <Mail className="size-4" aria-hidden="true" />
                {content.action.label}
              </a>
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="cta-outline border-ivory/70 text-ivory hover:border-ivory"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  {content.whatsappLabel}
                </a>
              ) : null}
            </div>
            {!whatsappHref ? (
              <p className="mt-5 max-w-md text-xs leading-6 text-ivory">{content.whatsappPendingText}</p>
            ) : null}
          </div>
        </div>
      </div>

      {property ? (
        <div className="page-shell border-b border-charcoal/12 lg:border-x">
          {mapEmbedUrl ? (
            <iframe
              src={mapEmbedUrl}
              title={`Official Google Maps location for ${property.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="block h-[28rem] w-full border-0 lg:h-[34rem]"
            />
          ) : (
            <div className="content-inset scroll-reveal flex min-h-72 flex-col justify-center bg-warm-sand/35 py-14 sm:py-16 lg:px-14">
              <MapPin className="size-7 text-olive" aria-hidden="true" />
              <h3 className="mt-7 font-serif text-4xl leading-none sm:text-5xl">{content.mapTitle}</h3>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-ink-soft sm:text-base">{content.mapPendingText}</p>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}
