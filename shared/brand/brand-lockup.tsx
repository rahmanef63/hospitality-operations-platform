import { BotanicalMark } from "./botanical-mark";
import { brandIdentity } from "./config";
import { cn } from "@/lib/utils";

type BrandLockupProps = {
  kind?: "master" | "property";
  compact?: boolean;
  inverse?: boolean;
  className?: string;
};

export function BrandLockup({
  kind = "master",
  compact = false,
  inverse = false,
  className,
}: BrandLockupProps) {
  const name = kind === "master" ? brandIdentity.masterName : brandIdentity.propertyName;
  return (
    <div
      className={cn(
        "inline-flex flex-col items-center text-center",
        inverse ? "text-ivory" : "text-charcoal",
        className,
      )}
      aria-label={`${name}, ${brandIdentity.tagline}`}
    >
      <span
        className={cn(
          "font-serif uppercase leading-none",
          compact ? "text-lg tracking-[0.28em]" : "text-3xl tracking-[0.34em] sm:text-4xl",
        )}
      >
        {name}
      </span>
      <span className={cn("mt-3 flex items-center", compact ? "gap-2" : "gap-4")} aria-hidden="true">
        <span className={cn("h-px bg-current opacity-40", compact ? "w-8" : "w-14 sm:w-20")} />
        <BotanicalMark className={compact ? "size-5" : "size-8"} />
        <span className={cn("h-px bg-current opacity-40", compact ? "w-8" : "w-14 sm:w-20")} />
      </span>
      {!compact ? (
        <span className="mt-2 text-[0.62rem] font-medium lowercase tracking-[0.42em] opacity-75 sm:text-xs">
          {brandIdentity.tagline}
        </span>
      ) : null}
    </div>
  );
}
