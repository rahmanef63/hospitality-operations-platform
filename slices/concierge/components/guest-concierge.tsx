"use client";

import { ArrowUpRight, LoaderCircle, MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ConciergeReply } from "@/shared/concierge";
import type { ConciergeMessage, GuestConciergeProps } from "../types";
import { PublicMobileDock } from "./public-mobile-dock";

function messageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function GuestConcierge({ navigation, config }: GuestConciergeProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ConciergeMessage[]>(() => [{ id: "opening", role: "assistant", text: config.openingMessage, suggestions: config.suggestions }]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  async function sendMessage(rawMessage: string) {
    const message = rawMessage.trim();
    if (!message || pending) return;
    setInput("");
    setMessages((current) => [...current, { id: messageId(), role: "user", text: message }]);
    setPending(true);
    try {
      const response = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const payload = await response.json() as { ok?: boolean; reply?: ConciergeReply };
      if (!response.ok || !payload.ok || !payload.reply) throw new Error("Concierge unavailable");
      const reply = payload.reply;
      setMessages((current) => [
        ...current,
        {
          id: messageId(),
          role: "assistant",
          text: reply.answer,
          actions: reply.actions,
          suggestions: reply.suggestions,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: messageId(),
          role: "assistant",
          text: config.unavailableMessage,
        },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <PublicMobileDock navigation={navigation} chatOpen={open} onChatOpen={() => setOpen(true)} chatLabel={config.mobileButtonLabel} showChat={config.enabled} />

      {config.enabled ? <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="kamyna-concierge-dialog"
        className="fixed bottom-6 right-6 z-[80] hidden min-h-13 items-center gap-3 border border-charcoal bg-charcoal px-5 text-xs font-bold tracking-[.1em] text-ivory uppercase shadow-[0_18px_45px_rgba(45,43,39,0.24)] transition hover:bg-olive md:flex"
      >
        <MessageCircle className="size-4" aria-hidden="true" />
        {config.desktopButtonLabel}
      </button> : null}

      {open && config.enabled ? (
        <>
          <button
            type="button"
            aria-label="Close concierge"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[91] cursor-default bg-charcoal/26 backdrop-blur-[2px]"
          />
          <section
            id="kamyna-concierge-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="kamyna-concierge-title"
            className="concierge-panel fixed z-[95] flex flex-col overflow-hidden border border-charcoal/15 bg-paper shadow-[0_30px_90px_rgba(45,43,39,0.3)]"
          >
            <header className="flex items-start justify-between gap-5 border-b border-charcoal/12 bg-charcoal px-5 py-4 text-ivory">
              <div>
                <p className="text-[0.62rem] font-bold tracking-[.16em] text-warm-sand uppercase">{config.eyebrow}</p>
                <h2 id="kamyna-concierge-title" className="mt-1 font-serif text-2xl leading-none">{config.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-11 items-center justify-center border border-ivory/18 text-ivory/75 hover:bg-ivory hover:text-charcoal"
              >
                <span className="sr-only">Close concierge</span>
                <X className="size-4" aria-hidden="true" />
              </button>
            </header>

            <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite">
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`max-w-[88%] px-4 py-3 text-sm leading-6 ${
                    message.role === "user" ? "ml-auto bg-charcoal text-ivory" : "border border-charcoal/12 bg-ivory"
                  }`}
                >
                  <p>{message.text}</p>
                  {message.actions?.length ? (
                    <div className="mt-3 grid gap-2">
                      {message.actions.map((action) => (
                        <a
                          key={action.href}
                          href={action.href}
                          target={action.external ? "_blank" : undefined}
                          rel={action.external ? "noreferrer" : undefined}
                          className="flex min-h-11 items-center justify-between gap-3 border-t border-current/18 pt-2 text-xs font-bold"
                        >
                          {action.label}
                          <ArrowUpRight className="size-3.5" aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  ) : null}
                  {message.role === "assistant" && message.suggestions?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => sendMessage(suggestion)}
                          className="min-h-10 border border-charcoal/18 bg-paper px-3 text-left text-[0.68rem] font-semibold hover:border-olive"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
              {pending ? (
                <div className="flex max-w-[88%] items-center gap-3 border border-charcoal/12 bg-ivory px-4 py-3 text-xs text-ink-soft">
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                  Memeriksa informasi terverifikasi…
                </div>
              ) : null}
            </div>

            <form
              className="border-t border-charcoal/12 bg-paper p-3"
              onSubmit={(event) => {
                event.preventDefault();
                void sendMessage(input);
              }}
            >
              <label className="sr-only" htmlFor="kamyna-concierge-input">Ask Ruma Kamyna</label>
              <div className="grid grid-cols-[1fr_auto] border border-charcoal/18 bg-white">
                <input
                  ref={inputRef}
                  id="kamyna-concierge-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  maxLength={400}
                  autoComplete="off"
                  placeholder={config.inputPlaceholder}
                  className="min-h-13 min-w-0 bg-transparent px-4 text-sm outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || pending}
                  className="flex size-13 items-center justify-center bg-charcoal text-ivory disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="sr-only">Send message</span>
                  <Send className="size-4" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-2 px-1 text-[0.62rem] leading-5 text-ink-soft">{config.privacyNote}</p>
            </form>
          </section>
        </>
      ) : null}
    </>
  );
}
