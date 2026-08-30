"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, House, Leaf, MessageCircle, MessagesSquare } from "lucide-react";
import { useEffect, useState } from "react";
import type { NavigationItem } from "@/shared/content";

const icons = {
  Stays: House,
  Philosophy: Leaf,
  About: BookOpenText,
  Enquire: MessageCircle,
} as const;

export function PublicMobileDock({
  navigation,
  chatOpen,
  onChatOpen,
  chatLabel,
  showChat,
}: {
  navigation: NavigationItem[];
  chatOpen: boolean;
  onChatOpen: () => void;
  chatLabel: string;
  showChat: boolean;
}) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  return (
    <nav
      aria-label="Mobile navigation"
      className={`fixed inset-x-0 bottom-0 z-[90] grid ${showChat ? "grid-cols-5" : "grid-cols-4"} border-t border-charcoal/12 bg-paper/96 pt-1.5 shadow-[0_-16px_40px_rgba(45,43,39,0.12)] backdrop-blur-xl md:hidden`}
      style={{
        paddingBottom: "max(0.45rem, env(safe-area-inset-bottom))",
        paddingLeft: "max(0.25rem, env(safe-area-inset-left))",
        paddingRight: "max(0.25rem, env(safe-area-inset-right))",
      }}
    >
      {navigation.slice(0, 4).map((item) => {
        const Icon = icons[item.label as keyof typeof icons] ?? House;
        const itemHash = item.href.startsWith("/#") ? item.href.slice(1) : "";
        const active = itemHash ? pathname === "/" && hash === itemHash : pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch={false}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-[0.58rem] font-semibold tracking-[.04em] transition ${
              active ? "text-charcoal" : "text-charcoal/58"
            }`}
          >
            <Icon className={`size-4.5 ${active ? "text-olive" : ""}`} aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
{showChat ? (
      <button
        type="button"
        aria-expanded={chatOpen}
        aria-controls="kamyna-concierge-dialog"
        onClick={onChatOpen}
        className={`flex min-h-14 flex-col items-center justify-center gap-1 px-1 text-[0.58rem] font-semibold tracking-[.04em] transition ${
          chatOpen ? "text-charcoal" : "text-charcoal/58"
        }`}
      >
        <MessagesSquare className={`size-4.5 ${chatOpen ? "text-olive" : ""}`} aria-hidden="true" />
        <span>{chatLabel}</span>
      </button>
      ) : null}
    </nav>
  );
}
