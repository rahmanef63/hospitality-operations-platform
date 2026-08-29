import { v } from "convex/values";
import { isWelcomeLocale } from "../shared/welcome/config";
import type { WelcomeLocale } from "../shared/welcome/types";

export const welcomeLocaleValidator = v.union(
  v.literal("id"), v.literal("en"), v.literal("ar"), v.literal("ja"), v.literal("zh-CN"),
  v.literal("ko"), v.literal("es"), v.literal("fr"), v.literal("de"), v.literal("pt"),
  v.literal("it"), v.literal("nl"), v.literal("ru"), v.literal("tr"), v.literal("th"),
  v.literal("vi"), v.literal("hi"), v.literal("ms"), v.literal("fil"), v.literal("la"),
);

export function welcomeLocaleValue(value: unknown): WelcomeLocale {
  if (!isWelcomeLocale(value)) throw new Error("Invalid welcome locale.");
  return value;
}

export function optionalWelcomeLocale(value: unknown): WelcomeLocale | undefined {
  return value === undefined || value === null || value === "" ? undefined : welcomeLocaleValue(value);
}
