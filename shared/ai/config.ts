import { AI_PROVIDERS, type AiProvider } from "./types";

export const AI_PROVIDER_META: Record<AiProvider, { label: string; description: string; modelHint: string }> = {
  openai: { label: "OpenAI", description: "Responses API with JSON Schema output.", modelHint: "Enter an available OpenAI model" },
  openrouter: { label: "OpenRouter", description: "OpenAI-compatible routing across supported models.", modelHint: "provider/model" },
  anthropic: { label: "Anthropic", description: "Messages API; output is validated before saving.", modelHint: "Enter an available Claude model" },
  gemini: { label: "Google Gemini", description: "Gemini generateContent with JSON response schema.", modelHint: "Enter an available Gemini model" },
};

export function isAiProvider(value: unknown): value is AiProvider {
  return typeof value === "string" && (AI_PROVIDERS as readonly string[]).includes(value);
}

export function validateAiModel(value: unknown): string {
  if (typeof value !== "string") throw new Error("AI model is required.");
  const model = value.trim();
  if (model.length < 2 || model.length > 160 || /[\u0000-\u001f]/.test(model)) throw new Error("AI model is invalid.");
  return model;
}

export function validateApiKey(value: unknown): string {
  if (typeof value !== "string") throw new Error("API key is required.");
  const key = value.trim();
  if (key.length < 12 || key.length > 600 || /\s/.test(key)) throw new Error("API key is invalid.");
  return key;
}
