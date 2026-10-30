import {
  AlertTriangle,
  BadgeCheck,
  Banknote,
  BedDouble,
  BookOpenText,
  Building2,
  CalendarDays,
  Check,
  Circle,
  Clock3,
  CreditCard,
  Eye,
  Flag,
  Globe2,
  HandCoins,
  House,
  Landmark,
  MapPin,
  MessageCircle,
  Minus,
  PackageCheck,
  ReceiptText,
  Sparkles,
  Tags,
  UserRound,
  UsersRound,
  WalletCards,
  Wrench,
  X,
} from "lucide-react";

export type PmsIconName =
  | "alert" | "bank" | "bed" | "booking" | "building" | "calendar" | "check" | "circle"
  | "clock" | "credit-card" | "eye" | "flag" | "globe" | "hand-coins" | "house" | "landmark"
  | "map" | "message" | "minus" | "package" | "receipt" | "sparkles" | "tag" | "user" | "users"
  | "wallet" | "wrench" | "x";

const icons = {
  alert: AlertTriangle,
  bank: Banknote,
  bed: BedDouble,
  booking: BookOpenText,
  building: Building2,
  calendar: CalendarDays,
  check: BadgeCheck,
  circle: Circle,
  clock: Clock3,
  "credit-card": CreditCard,
  eye: Eye,
  flag: Flag,
  globe: Globe2,
  "hand-coins": HandCoins,
  house: House,
  landmark: Landmark,
  map: MapPin,
  message: MessageCircle,
  minus: Minus,
  package: PackageCheck,
  receipt: ReceiptText,
  sparkles: Sparkles,
  tag: Tags,
  user: UserRound,
  users: UsersRound,
  wallet: WalletCards,
  wrench: Wrench,
  x: X,
} as const;

export function PmsIcon({ name, className = "size-4" }: { name?: PmsIconName; className?: string }) {
  const Icon = name ? icons[name] : Check;
  return <Icon className={className} aria-hidden="true" />;
}
