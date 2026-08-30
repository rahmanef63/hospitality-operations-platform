import type { WelcomeLocale } from "../welcome/types";
import type {
  AmenityCategory,
  BlockReason,
  PropertyStatus,
  PropertyType,
  PublicationStatus,
  ReservationSource,
  ReservationStatus,
  TaskCategory,
  TaskPriority,
  TaskStatus,
  TransactionKind,
  TransactionMethod,
  TransactionStatus,
  UnitStatus,
  UnitType,
} from "./constants";

export type PmsProperty = {
  id: string;
  slug: string;
  name: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  publicationStatus: PublicationStatus;
  locationLabel?: string;
  addressLine?: string;
  locality?: string;
  region?: string;
  postalCode?: string;
  countryCode: string;
  timezone: string;
  currency: string;
  bedroomCount?: number;
  bathroomCount?: number;
  maxGuests?: number;
  baseNightlyRate?: number;
  publicSummary?: string;
  publicPath?: string;
  internalNotes?: string;
  createdAt: number;
  updatedAt: number;
};

export type PmsUnit = {
  id: string;
  propertyId: string;
  propertyName: string;
  code: string;
  name: string;
  unitType: UnitType;
  status: UnitStatus;
  bookable: boolean;
  bedroomCount?: number;
  bathroomCount?: number;
  maxGuests?: number;
  baseNightlyRate?: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
};

export type PmsAmenity = {
  id: string;
  propertyId: string;
  propertyName: string;
  key: string;
  name: string;
  category: AmenityCategory;
  description?: string;
  featured: boolean;
  publicVisible: boolean;
  active: boolean;
  createdAt: number;
  updatedAt: number;
};

export type PmsGuest = {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  nationality?: string;
  preferredLocale?: WelcomeLocale;
  notes?: string;
  createdAt: number;
  updatedAt: number;
};

export type PmsReservation = {
  id: string;
  reference: string;
  externalReference?: string;
  propertyId: string;
  propertyName: string;
  unitId?: string;
  unitName?: string;
  guestId: string;
  guestName: string;
  guestPreferredLocale?: WelcomeLocale;
  welcomeLocale: WelcomeLocale;
  status: ReservationStatus;
  source: ReservationSource;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults?: number;
  children?: number;
  nightlyRate?: number;
  accommodationAmount?: number;
  extraFees?: number;
  discountAmount?: number;
  totalAmount?: number;
  paidAmount: number;
  outstandingAmount: number;
  currency: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
};

export type PmsAvailabilityBlock = {
  id: string;
  propertyId: string;
  propertyName: string;
  unitId?: string;
  unitName?: string;
  title: string;
  reason: BlockReason;
  startDate: string;
  endDate: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
};

export type PmsTransaction = {
  id: string;
  propertyId: string;
  propertyName: string;
  reservationId?: string;
  reservationReference?: string;
  kind: TransactionKind;
  category: string;
  amount: number;
  currency: string;
  method: TransactionMethod;
  status: TransactionStatus;
  occurredOn: string;
  reference?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
};

export type PmsTask = {
  id: string;
  propertyId: string;
  propertyName: string;
  unitId?: string;
  unitName?: string;
  reservationId?: string;
  reservationReference?: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueOn?: string;
  assignee?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
};

export type PmsAuditEvent = {
  id: string;
  propertyId?: string;
  resource: string;
  resourceId: string;
  action: "create" | "update" | "archive" | "seed";
  summary: string;
  actorEmailHash: string;
  createdAt: number;
};

export type PmsCatalog = {
  properties: PmsProperty[];
  units: PmsUnit[];
  amenities: PmsAmenity[];
};

export type PmsBookingData = {
  guests: PmsGuest[];
  reservations: PmsReservation[];
};

export type PmsCalendarData = {
  reservations: PmsReservation[];
  blocks: PmsAvailabilityBlock[];
};

export type PmsFinanceData = {
  transactions: PmsTransaction[];
  totals: { payments: number; refunds: number; expenses: number; net: number };
};

export type PmsDashboard = {
  metrics: {
    activeProperties: number;
    upcomingReservations: number;
    inHouse: number;
    arrivalsNextSevenDays: number;
    openTasks: number;
    incomeThisMonth: number;
    expensesThisMonth: number;
    outstandingBalance: number;
  };
  properties: Array<Pick<PmsProperty, "id" | "name" | "slug" | "bedroomCount" | "status"> & { amenityCount: number }>;
  arrivals: PmsReservation[];
  departures: PmsReservation[];
  tasks: PmsTask[];
  activity: PmsAuditEvent[];
};
