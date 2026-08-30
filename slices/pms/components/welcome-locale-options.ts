import { WELCOME_LOCALE_OPTIONS } from "@/shared/welcome";
import type { PmsSelectOption } from "./ui-options";

export const welcomeLocaleSelectOptions: PmsSelectOption[] = WELCOME_LOCALE_OPTIONS.map((locale) => ({
  value: locale.code,
  label: locale.nativeLabel,
  description: locale.label,
  icon: "globe",
  tone: locale.direction === "rtl" ? "purple" : "blue",
}));
