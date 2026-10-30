import type { PmsCatalog } from "@/shared/pms";
import type { PmsSelectOption } from "./ui-options";

export function propertyOptions(catalog: PmsCatalog, includeAll = false): PmsSelectOption[] {
  const options = catalog.properties.map((property): PmsSelectOption => ({
    value: property.id,
    label: property.name,
    description: `${property.locationLabel ?? "Lokasi belum diisi"} · ${property.currency}`,
    icon: property.propertyType === "apartment" ? "building" : "house",
    tone: property.status === "active" ? "olive" : "neutral",
  }));
  return includeAll
    ? [{ value: "", label: "Semua properti", icon: "building", tone: "neutral" }, ...options]
    : options;
}
