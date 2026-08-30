"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[marketing:error]", error);
  }, [error]);

  return (
    <main id="main-content" className="page-shell flex min-h-[70vh] items-center py-24">
      <div className="max-w-2xl">
        <p className="eyebrow text-earth-ink">Something shifted</p>
        <h1 className="mt-5 font-serif text-5xl leading-none sm:text-7xl">This page needs a quiet reset.</h1>
        <p className="mt-7 max-w-lg text-sm leading-7 text-ink-soft">
          The experience could not be loaded. Try once more; no information has been submitted or changed.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-ivory"
        >
          <RotateCcw className="size-4" /> Try again
        </button>
      </div>
    </main>
  );
}
