import { describe, expect, it } from "vitest";
import { answerConcierge, normalizeConciergeMessage } from "@/shared/concierge";
import { RUMA_KAMYNA_PUBLIC_FALLBACK } from "@/shared/pms";

const context = {
  facts: RUMA_KAMYNA_PUBLIC_FALLBACK,
  address: "Kecamatan Megamendung, Kabupaten Bogor, Jawa Barat 16770, Indonesia",
  email: "hello@kamynaliving.com",
  whatsappHref: "https://wa.me/6281234567890",
  mapHref: "https://www.google.com/maps/place/RUMA+KAMYNA",
};

describe("verified-information concierge", () => {
  it("sanitizes markup, controls, and excessive whitespace", () => {
    expect(normalizeConciergeMessage("  <b>Lokasi</b>\n\u0000 di mana? ")).toBe("Lokasi di mana?");
    expect(normalizeConciergeMessage("   ")).toBeNull();
    expect(normalizeConciergeMessage(null)).toBeNull();
  });

  it("answers facility questions only with confirmed facts", () => {
    const reply = answerConcierge("Fasilitas apa saja?", context);
    expect(reply.topic).toBe("amenities");
    expect(reply.answer).toContain("3 kamar tidur");
    expect(reply.answer).toContain("Kolam renang");
    expect(reply.answer).toContain("Gym");
    expect(reply.answer).toContain("Jacuzzi");
    expect(reply.answer).toContain("Pemandangan gunung");
    expect(reply.answer).not.toContain("harga");
  });

  it("does not invent price, availability, or policies", () => {
    const reply = answerConcierge("Berapa harga dan apakah weekend tersedia?", context);
    expect(reply.topic).toBe("booking");
    expect(reply.answer).toContain("belum dipublikasikan");
    expect(reply.actions[0]?.href).toContain("wa.me");
  });

  it("uses the verified address and official map handoff", () => {
    const reply = answerConcierge("Lokasinya di mana?", context);
    expect(reply.topic).toBe("location");
    expect(reply.answer).toContain("Megamendung");
    expect(reply.actions[0]).toMatchObject({ label: "Buka Google Maps", href: context.mapHref });
  });
});
