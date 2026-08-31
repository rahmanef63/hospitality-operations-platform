"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { PmsIcon } from "./pms-icon";
import type { PmsSelectOption, PmsTone } from "./ui-options";

const toneClass: Record<PmsTone, string> = {
  neutral: "border-charcoal/14 bg-charcoal/[.045] text-charcoal/72",
  olive: "border-olive/25 bg-olive/10 text-olive",
  blue: "border-[#51718d]/25 bg-[#e3edf4] text-[#365d78]",
  amber: "border-[#a3721f]/25 bg-[#f1e4cb] text-[#825912]",
  red: "border-[#a6392c]/25 bg-[#f4e0db] text-[#833126]",
  purple: "border-[#765b8d]/25 bg-[#eee7f3] text-[#674b7d]",
  green: "border-[#43704f]/25 bg-[#dfe9df] text-[#31533b]",
};


export function TagSelect({
  name,
  options,
  defaultValue,
  value,
  onValueChange,
  placeholder = "Pilih opsi",
  disabled = false,
  required = false,
  className = "",
}: {
  name: string;
  options: PmsSelectOption[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}) {
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const currentValue = controlled ? value : internalValue;
  const selected = useMemo(
    () => options.find((option) => option.value === currentValue),
    [currentValue, options],
  );

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", close);
    window.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("mousedown", close);
      window.removeEventListener("keydown", escape);
    };
  }, [open]);

  function choose(next: string) {
    if (!controlled) setInternalValue(next);
    onValueChange?.(next);
    setOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      setOpen(true);
      setActiveIndex(Math.max(0, options.findIndex((option) => option.value === currentValue)));
      return;
    }
    if (!open) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((current) => (current + delta + options.length) % options.length);
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = options[activeIndex];
      if (option) choose(option.value);
    }
  }

  return (
    <div ref={rootRef} className={`relative mt-2 ${className}`}>
      <input type="hidden" name={name} value={currentValue} />
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-expanded={open}
        data-required={required || undefined}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-[.35rem] border border-charcoal/16 bg-white px-3 text-left text-sm shadow-[0_1px_2px_rgba(45,43,39,.04)] outline-none transition hover:border-charcoal/28 focus:border-olive focus:ring-2 focus:ring-olive/20 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {selected ? (
          <span className={`inline-flex min-w-0 items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClass[selected.tone ?? "neutral"]}`}>
            <PmsIcon name={selected.icon} className="size-3.5 shrink-0" />
            <span className="truncate">{selected.label}</span>
          </span>
        ) : <span className="text-charcoal/44">{placeholder}</span>}
        <ChevronDown className={`size-4 shrink-0 text-charcoal/42 transition ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open ? (
        <div
          id={listId}
          role="listbox"
          aria-label={placeholder}
          className="absolute inset-x-0 top-[calc(100%+.4rem)] z-40 max-h-72 overflow-y-auto rounded-[.45rem] border border-charcoal/14 bg-white p-1.5 shadow-[0_18px_55px_rgba(45,43,39,.2)]"
        >
          {options.map((option, index) => {
            const active = option.value === currentValue;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(option.value)}
                className={`grid min-h-12 w-full grid-cols-[1fr_auto] items-center gap-3 rounded-[.3rem] px-2.5 py-2 text-left transition ${activeIndex === index ? "bg-charcoal/[.055]" : "hover:bg-charcoal/[.04]"}`}
              >
                <span className="min-w-0">
                  <span className={`inline-flex max-w-full items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClass[option.tone ?? "neutral"]}`}>
                    <PmsIcon name={option.icon} className="size-3.5 shrink-0" />
                    <span className="truncate">{option.label}</span>
                  </span>
                  {option.description ? <span className="mt-1.5 block truncate px-1 text-[.68rem] text-ink-soft">{option.description}</span> : null}
                </span>
                {active ? <Check className="size-4 text-olive" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
