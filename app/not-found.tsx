import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLockup, BotanicalMark } from "@/shared/brand";

export default function NotFound() {
  return (
    <main className="surface-grain flex min-h-screen items-center justify-center bg-ivory px-6 py-16 text-charcoal">
      <div className="max-w-xl text-center">
        <BrandLockup compact />
        <BotanicalMark className="mx-auto mt-16 size-14 text-taupe" />
        <p className="eyebrow mt-8 text-earth-ink">Page not found</p>
        <h1 className="mt-5 font-serif text-5xl leading-none sm:text-7xl">A quiet turn in the wrong direction.</h1>
        <p className="mx-auto mt-7 max-w-md text-sm leading-7 text-ink-soft">
          The page you were looking for is not here. Return to the collection and continue at your own pace.
        </p>
        <Link
          prefetch={false}
          href="/"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-charcoal/20 px-6 py-3 text-sm font-semibold transition-colors hover:bg-charcoal hover:text-ivory"
        >
          <ArrowLeft className="size-4" /> Return home
        </Link>
      </div>
    </main>
  );
}
