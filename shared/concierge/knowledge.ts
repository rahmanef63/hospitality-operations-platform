import type { ConciergeContext, ConciergeReply } from "./types";

const DEFAULT_SUGGESTIONS = [
  "Fasilitas apa saja?",
  "Lokasinya di mana?",
  "Bagaimana cara reservasi?",
] as const;

function includesAny(message: string, terms: readonly string[]) {
  return terms.some((term) => message.includes(term));
}

function contactActions(context: ConciergeContext) {
  if (context.whatsappHref) {
    const text = encodeURIComponent("Halo Ruma Kamyna, saya ingin menanyakan ketersediaan dan detail menginap.");
    return [{ label: "Chat host via WhatsApp", href: `${context.whatsappHref}?text=${text}`, external: true }];
  }
  return [{ label: "Email Ruma Kamyna", href: `mailto:${context.email}?subject=Ruma%20Kamyna%20stay%20enquiry` }];
}

export function normalizeConciergeMessage(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value
    .replace(/<[^>]*>/g, " ")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 400);
  return normalized || null;
}

export function answerConcierge(message: string, context: ConciergeContext): ConciergeReply {
  const input = message.toLowerCase();
  const suggestions = [...DEFAULT_SUGGESTIONS];

  if (includesAny(input, ["fasilitas", "amenit", "kolam", "pool", "gym", "jacuzzi", "gunung", "view"])) {
    const bedrooms = context.facts.bedroomCount ? `${context.facts.bedroomCount} kamar tidur` : null;
    const amenities = context.facts.amenities.map((item) => item.name);
    const details = [bedrooms, ...amenities].filter(Boolean).join(", ");
    return {
      answer: `Fasilitas terverifikasi Ruma Kamyna saat ini adalah ${details}. Detail lain hanya akan ditambahkan setelah dikonfirmasi oleh pengelola.`,
      topic: "amenities",
      actions: [],
      suggestions,
    };
  }

  if (includesAny(input, ["lokasi", "alamat", "map", "maps", "peta", "di mana", "dimana", "arah", "route", "rute"])) {
    return {
      answer: `Ruma Kamyna berada di ${context.address}. Untuk petunjuk kedatangan yang paling akurat, gunakan profil peta resmi atau hubungi host sebelum berangkat.`,
      topic: "location",
      actions: context.mapHref
        ? [{ label: "Buka Google Maps", href: context.mapHref, external: true }, ...contactActions(context)]
        : contactActions(context),
      suggestions,
    };
  }

  if (includesAny(input, ["kamar", "bedroom", "bathroom", "kamar mandi", "kapasitas", "orang", "guest", "tamu"])) {
    const rooms = context.facts.bedroomCount
      ? `Ruma Kamyna memiliki ${context.facts.bedroomCount} kamar tidur.`
      : "Jumlah kamar tidur belum dipublikasikan.";
    const capacity = context.facts.maxGuests
      ? ` Kapasitas terverifikasi adalah ${context.facts.maxGuests} tamu.`
      : " Kapasitas maksimal dan jumlah kamar mandi belum dipublikasikan.";
    return { answer: `${rooms}${capacity}`, topic: "rooms", actions: contactActions(context), suggestions };
  }

  if (includesAny(input, ["harga", "price", "rate", "tarif", "booking", "reservasi", "pesan", "available", "availability", "tersedia", "check-in", "check in", "check-out", "check out", "cancel", "batal", "kebijakan"])) {
    return {
      answer: "Harga, ketersediaan, waktu check-in/check-out, dan kebijakan pembatalan belum dipublikasikan. Host akan memberikan informasi terbaru berdasarkan tanggal menginap Anda.",
      topic: "booking",
      actions: contactActions(context),
      suggestions,
    };
  }

  if (includesAny(input, ["kontak", "contact", "whatsapp", "wa", "host", "admin", "telepon", "phone", "email"])) {
    return {
      answer: "Anda dapat menghubungi host Ruma Kamyna untuk ketersediaan, harga, kebutuhan khusus, atau pertanyaan yang belum tercakup di sini.",
      topic: "contact",
      actions: contactActions(context),
      suggestions,
    };
  }

  return {
    answer: `${context.facts.publicSummary ?? "Ruma Kamyna adalah villa privat di Megamendung, Puncak Bogor."} Saya hanya menggunakan informasi properti yang sudah diverifikasi. Pilih salah satu topik di bawah atau tulis pertanyaan Anda.`,
    topic: "welcome",
    actions: [],
    suggestions,
  };
}
