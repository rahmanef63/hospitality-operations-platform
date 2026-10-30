import { formatCurrency, type PmsCatalog, type PmsReservation } from "@/shared/pms";
import type { PmsSelectOption } from "./ui-options";

function rateLabel(value: number | undefined, currency: string) {
  return value === undefined ? "Harga dasar belum diisi" : `${formatCurrency(value, currency)} / malam`;
}

export function accommodationOptions(catalog: PmsCatalog, wholeLabel = "Seluruh properti"): PmsSelectOption[] {
  return catalog.properties.flatMap((property) => {
    const whole: PmsSelectOption = {
      value: `property:${property.id}`,
      label: property.name,
      description: `${wholeLabel} · ${rateLabel(property.baseNightlyRate, property.currency)}`,
      icon: property.propertyType === "apartment" ? "building" : "house",
      tone: "olive",
    };
    const units = catalog.units
      .filter((unit) => unit.propertyId === property.id && unit.status === "active" && unit.bookable)
      .map((unit): PmsSelectOption => ({
        value: `unit:${unit.id}`,
        label: unit.name,
        description: `${property.name} · ${unit.code} · ${rateLabel(unit.baseNightlyRate ?? property.baseNightlyRate, property.currency)}`,
        icon: unit.unitType === "room" ? "bed" : unit.unitType === "apartment" ? "building" : "house",
        tone: "blue",
      }));
    return [whole, ...units];
  });
}

export function resolveAccommodation(value: string, catalog: PmsCatalog) {
  const [kind, id] = value.split(":");
  const unit = kind === "unit" ? catalog.units.find((item) => item.id === id) : undefined;
  const propertyId = unit?.propertyId ?? (kind === "property" ? id : catalog.properties[0]?.id);
  const property = catalog.properties.find((item) => item.id === propertyId);
  return { unit, property, propertyId: property?.id ?? "", unitId: unit?.id ?? "" };
}

export function initialAccommodation(
  record: Pick<PmsReservation, "propertyId" | "unitId"> | { propertyId?: string; unitId?: string } | undefined,
  catalog: PmsCatalog,
) {
  if (record?.unitId) return `unit:${record.unitId}`;
  if (record?.propertyId) return `property:${record.propertyId}`;
  return catalog.properties[0] ? `property:${catalog.properties[0].id}` : "";
}
