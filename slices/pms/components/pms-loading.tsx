export function PmsLoading({ label }: { label: string }) {
  return (
    <div role="status" aria-busy="true" className="min-h-[60vh]">
      <span className="sr-only">{label}</span>
      <div className="border-b border-charcoal/12 bg-[#f8f8f5] px-4 py-10 sm:px-8 lg:px-12 lg:py-14" aria-hidden="true">
        <div className="mx-auto max-w-[92rem]">
          <div className="h-2.5 w-28 bg-charcoal/12" />
          <div className="mt-6 h-12 w-3/4 max-w-3xl bg-charcoal/10 sm:h-16" />
          <div className="mt-6 h-3 w-full max-w-xl bg-charcoal/8" />
        </div>
      </div>
      <div className="mx-auto grid max-w-[92rem] gap-4 px-4 py-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-12" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((cell) => (
          <div key={cell} className="h-40 border border-charcoal/10 bg-white p-5">
            <div className="size-10 rounded-full bg-olive/10" />
            <div className="mt-6 h-2.5 w-20 bg-charcoal/12" />
            <div className="mt-3 h-8 w-24 bg-charcoal/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
