"use client";

import { Search, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { TagSelect } from "./tag-select";
import type { PmsSelectOption } from "./ui-options";

export function CollectionSearch({
  targetId,
  placeholder = "Cari data…",
  filters = [],
}: {
  targetId: string;
  placeholder?: string;
  filters?: PmsSelectOption[];
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const helpId = useId();
  const countRef = useRef<HTMLOutputElement>(null);

  useEffect(() => {
    const root = document.getElementById(targetId);
    if (!root) return;
    const normalized = query.trim().toLowerCase();
    const nodes = [...root.querySelectorAll<HTMLElement>("[data-search]")];
    let count = 0;
    for (const node of nodes) {
      const text = (node.dataset.search ?? "").toLowerCase();
      const status = node.dataset.status ?? "";
      const matches = (!normalized || text.includes(normalized)) && (filter === "all" || status === filter);
      node.hidden = !matches;
      if (matches) count += 1;
    }
    if (countRef.current) countRef.current.value = String(count);
  }, [filter, query, targetId]);

  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (event.key === "/" && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, []);

  const filterOptions: PmsSelectOption[] = [
    { value: "all", label: "Semua", icon: "tag", tone: "neutral" },
    ...filters,
  ];

  return (
    <div className="grid gap-3 rounded-[.45rem] border border-charcoal/12 bg-white p-3 sm:grid-cols-[minmax(0,1fr)_14rem_auto] sm:items-center">
      <label className="relative block">
        <span className="sr-only">{placeholder}</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-charcoal/38" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          aria-describedby={helpId}
          className="min-h-12 w-full rounded-[.35rem] border border-charcoal/14 bg-[#f8f8f5] pl-10 pr-10 text-sm outline-none focus:border-olive focus:ring-2 focus:ring-olive/20"
        />
        {query ? (
          <button type="button" onClick={() => setQuery("")} aria-label="Hapus pencarian" className="absolute right-1 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center text-charcoal/46 hover:text-charcoal">
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </label>
      {filters.length ? <TagSelect name={`${targetId}-filter`} options={filterOptions} value={filter} onValueChange={setFilter} /> : <span />}
      <p id={helpId} className="whitespace-nowrap text-xs text-ink-soft"><output ref={countRef} className="font-bold text-charcoal">0</output> hasil · tekan / untuk mencari</p>
    </div>
  );
}
