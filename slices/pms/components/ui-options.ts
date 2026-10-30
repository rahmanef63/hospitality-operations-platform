import type { PmsIconName } from "./pms-icon";

export type PmsTone = "neutral" | "olive" | "blue" | "amber" | "red" | "purple" | "green";
export type PmsSelectOption = {
  value: string;
  label: string;
  description?: string;
  icon?: PmsIconName;
  tone?: PmsTone;
};

export const reservationStatusOptions: PmsSelectOption[] = [
  { value: "inquiry", label: "Inquiry", icon: "message", tone: "neutral" },
  { value: "tentative", label: "Tentatif", icon: "clock", tone: "amber" },
  { value: "confirmed", label: "Terkonfirmasi", icon: "check", tone: "green" },
  { value: "checked_in", label: "Menginap", icon: "house", tone: "olive" },
  { value: "checked_out", label: "Selesai", icon: "package", tone: "blue" },
  { value: "cancelled", label: "Dibatalkan", icon: "x", tone: "red" },
  { value: "no_show", label: "No-show", icon: "minus", tone: "red" },
];

export const reservationSourceOptions: PmsSelectOption[] = [
  { value: "direct", label: "Direct", icon: "user", tone: "olive" },
  { value: "whatsapp", label: "WhatsApp", icon: "message", tone: "green" },
  { value: "airbnb", label: "Airbnb", icon: "house", tone: "red" },
  { value: "booking", label: "Booking.com", icon: "booking", tone: "blue" },
  { value: "agoda", label: "Agoda", icon: "globe", tone: "purple" },
  { value: "traveloka", label: "Traveloka", icon: "calendar", tone: "blue" },
  { value: "other", label: "Lainnya", icon: "tag", tone: "neutral" },
];

export const propertyTypeOptions: PmsSelectOption[] = [
  { value: "villa", label: "Villa", icon: "house", tone: "olive" },
  { value: "homestay", label: "Homestay", icon: "users", tone: "green" },
  { value: "guesthouse", label: "Guesthouse", icon: "building", tone: "blue" },
  { value: "apartment", label: "Apartemen", icon: "building", tone: "purple" },
  { value: "house", label: "Rumah", icon: "house", tone: "amber" },
  { value: "other", label: "Lainnya", icon: "tag", tone: "neutral" },
];

export const unitTypeOptions: PmsSelectOption[] = [
  { value: "villa", label: "Villa", icon: "house", tone: "olive" },
  { value: "room", label: "Kamar", icon: "bed", tone: "blue" },
  { value: "suite", label: "Suite", icon: "sparkles", tone: "purple" },
  { value: "house", label: "Rumah", icon: "house", tone: "amber" },
  { value: "apartment", label: "Apartemen", icon: "building", tone: "green" },
  { value: "other", label: "Lainnya", icon: "tag", tone: "neutral" },
];

export const activeStatusOptions: PmsSelectOption[] = [
  { value: "active", label: "Aktif", icon: "check", tone: "green" },
  { value: "inactive", label: "Tidak aktif", icon: "minus", tone: "neutral" },
];

export const unitStatusOptions: PmsSelectOption[] = [
  { value: "active", label: "Aktif", icon: "check", tone: "green" },
  { value: "out_of_service", label: "Tidak dapat digunakan", icon: "wrench", tone: "red" },
  { value: "inactive", label: "Tidak aktif", icon: "minus", tone: "neutral" },
];

export const publicationOptions: PmsSelectOption[] = [
  { value: "draft", label: "Draft", icon: "eye", tone: "amber" },
  { value: "published", label: "Published", icon: "globe", tone: "green" },
];

export const amenityCategoryOptions: PmsSelectOption[] = [
  { value: "leisure", label: "Leisure", icon: "sparkles", tone: "purple" },
  { value: "wellness", label: "Wellness", icon: "users", tone: "green" },
  { value: "view", label: "View", icon: "eye", tone: "blue" },
  { value: "service", label: "Service", icon: "package", tone: "olive" },
  { value: "accessibility", label: "Accessibility", icon: "user", tone: "amber" },
  { value: "other", label: "Lainnya", icon: "tag", tone: "neutral" },
];

export const blockReasonOptions: PmsSelectOption[] = [
  { value: "owner_use", label: "Owner use", icon: "house", tone: "purple" },
  { value: "maintenance", label: "Maintenance", icon: "wrench", tone: "amber" },
  { value: "closed", label: "Ditutup", icon: "x", tone: "red" },
  { value: "other", label: "Lainnya", icon: "tag", tone: "neutral" },
];

export const transactionKindOptions: PmsSelectOption[] = [
  { value: "payment", label: "Pembayaran", icon: "hand-coins", tone: "green" },
  { value: "refund", label: "Refund", icon: "wallet", tone: "amber" },
  { value: "expense", label: "Pengeluaran", icon: "receipt", tone: "red" },
];

export const transactionMethodOptions: PmsSelectOption[] = [
  { value: "cash", label: "Tunai", icon: "bank", tone: "green" },
  { value: "bank_transfer", label: "Transfer bank", icon: "landmark", tone: "blue" },
  { value: "card", label: "Kartu", icon: "credit-card", tone: "purple" },
  { value: "e_wallet", label: "E-wallet", icon: "wallet", tone: "olive" },
  { value: "ota", label: "OTA", icon: "globe", tone: "amber" },
  { value: "other", label: "Lainnya", icon: "tag", tone: "neutral" },
];

export const transactionStatusOptions: PmsSelectOption[] = [
  { value: "pending", label: "Pending", icon: "clock", tone: "amber" },
  { value: "completed", label: "Selesai", icon: "check", tone: "green" },
  { value: "void", label: "Void", icon: "x", tone: "red" },
];

export const transactionCategoryOptions: PmsSelectOption[] = [
  { value: "Akomodasi", label: "Akomodasi", icon: "bed", tone: "olive" },
  { value: "Deposit", label: "Deposit", icon: "wallet", tone: "blue" },
  { value: "Layanan tambahan", label: "Layanan tambahan", icon: "sparkles", tone: "purple" },
  { value: "Housekeeping", label: "Housekeeping", icon: "package", tone: "green" },
  { value: "Maintenance", label: "Maintenance", icon: "wrench", tone: "amber" },
  { value: "Operasional", label: "Operasional", icon: "building", tone: "neutral" },
  { value: "Lainnya", label: "Lainnya", icon: "tag", tone: "neutral" },
];

export const taskCategoryOptions: PmsSelectOption[] = [
  { value: "housekeeping", label: "Housekeeping", icon: "package", tone: "green" },
  { value: "maintenance", label: "Maintenance", icon: "wrench", tone: "amber" },
  { value: "guest_request", label: "Permintaan tamu", icon: "message", tone: "blue" },
  { value: "inspection", label: "Inspeksi", icon: "eye", tone: "purple" },
  { value: "other", label: "Lainnya", icon: "tag", tone: "neutral" },
];

export const taskPriorityOptions: PmsSelectOption[] = [
  { value: "low", label: "Rendah", icon: "flag", tone: "neutral" },
  { value: "normal", label: "Normal", icon: "flag", tone: "blue" },
  { value: "high", label: "Tinggi", icon: "flag", tone: "amber" },
  { value: "urgent", label: "Mendesak", icon: "alert", tone: "red" },
];

export const taskStatusOptions: PmsSelectOption[] = [
  { value: "open", label: "Terbuka", icon: "circle", tone: "neutral" },
  { value: "in_progress", label: "Dikerjakan", icon: "clock", tone: "blue" },
  { value: "done", label: "Selesai", icon: "check", tone: "green" },
  { value: "cancelled", label: "Dibatalkan", icon: "x", tone: "red" },
];

export function optionFor(value: string, options: PmsSelectOption[]) {
  return options.find((option) => option.value === value)
    ?? { value, label: value.replaceAll("_", " "), icon: "tag" as const, tone: "neutral" as const };
}
