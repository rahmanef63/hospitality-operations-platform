import { v } from "convex/values";

export const aiProviderValidator = v.union(
  v.literal("openai"),
  v.literal("openrouter"),
  v.literal("anthropic"),
  v.literal("gemini"),
);
