import { PmsIcon } from "./pms-icon";
import { optionFor, type PmsSelectOption, type PmsTone } from "./ui-options";

const tones: Record<PmsTone, string> = {
  neutral: "border-charcoal/14 bg-charcoal/[.045] text-charcoal/68",
  olive: "border-olive/25 bg-olive/10 text-olive",
  blue: "border-[#51718d]/25 bg-[#e3edf4] text-[#365d78]",
  amber: "border-[#a3721f]/25 bg-[#f1e4cb] text-[#825912]",
  red: "border-[#a6392c]/25 bg-[#f4e0db] text-[#833126]",
  purple: "border-[#765b8d]/25 bg-[#eee7f3] text-[#674b7d]",
  green: "border-[#43704f]/25 bg-[#dfe9df] text-[#31533b]",
};

export function StatusPill({
  value,
  options,
  label,
  tone,
}: {
  value: string;
  options?: PmsSelectOption[];
  label?: string;
  tone?: PmsTone;
}) {
  const option = options ? optionFor(value, options) : { value, label: label ?? value, tone: tone ?? "neutral" as PmsTone };
  return (
    <span className={`inline-flex min-h-7 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[.64rem] font-bold tracking-[.045em] ${tones[option.tone ?? tone ?? "neutral"]}`}>
      {"icon" in option ? <PmsIcon name={option.icon} className="size-3.5" /> : null}
      <span>{label ?? option.label}</span>
    </span>
  );
}
