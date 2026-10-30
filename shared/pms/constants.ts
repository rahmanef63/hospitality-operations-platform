export const PROPERTY_TYPES = ["villa", "homestay", "guesthouse", "apartment", "house", "other"] as const;
export const PROPERTY_STATUSES = ["active", "inactive"] as const;
export const PUBLICATION_STATUSES = ["draft", "published"] as const;
export const UNIT_TYPES = ["villa", "room", "suite", "house", "apartment", "other"] as const;
export const UNIT_STATUSES = ["active", "out_of_service", "inactive"] as const;
export const AMENITY_CATEGORIES = ["leisure", "wellness", "view", "service", "accessibility", "other"] as const;
export const RESERVATION_STATUSES = [
  "inquiry",
  "tentative",
  "confirmed",
  "checked_in",
  "checked_out",
  "cancelled",
  "no_show",
] as const;
export const RESERVATION_SOURCES = ["direct", "whatsapp", "airbnb", "booking", "agoda", "traveloka", "other"] as const;
export const BLOCK_REASONS = ["owner_use", "maintenance", "closed", "other"] as const;
export const TRANSACTION_KINDS = ["payment", "refund", "expense"] as const;
export const TRANSACTION_METHODS = ["cash", "bank_transfer", "card", "e_wallet", "ota", "other"] as const;
export const TRANSACTION_STATUSES = ["pending", "completed", "void"] as const;
export const TASK_CATEGORIES = ["housekeeping", "maintenance", "guest_request", "inspection", "other"] as const;
export const TASK_PRIORITIES = ["low", "normal", "high", "urgent"] as const;
export const TASK_STATUSES = ["open", "in_progress", "done", "cancelled"] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type PropertyStatus = (typeof PROPERTY_STATUSES)[number];
export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];
export type UnitType = (typeof UNIT_TYPES)[number];
export type UnitStatus = (typeof UNIT_STATUSES)[number];
export type AmenityCategory = (typeof AMENITY_CATEGORIES)[number];
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];
export type ReservationSource = (typeof RESERVATION_SOURCES)[number];
export type BlockReason = (typeof BLOCK_REASONS)[number];
export type TransactionKind = (typeof TRANSACTION_KINDS)[number];
export type TransactionMethod = (typeof TRANSACTION_METHODS)[number];
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];
export type TaskCategory = (typeof TASK_CATEGORIES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskStatus = (typeof TASK_STATUSES)[number];
