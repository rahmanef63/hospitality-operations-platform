import type { AiProvider } from "../types";
import { anthropicText, chatCompletionText, geminiText, openAiText, parseJsonText, postProviderJson } from "./common";

export async function requestStructuredTranslation(input: {
  provider: AiProvider;
  model: string;
  apiKey: string;
  system: string;
  user: string;
  schema: unknown;
  siteUrl?: string;
}): Promise<unknown> {
  if (input.provider === "openai") {
    const response = await postProviderJson("https://api.openai.com/v1/responses", {
      Authorization: `Bearer ${input.apiKey}`,
    }, {
      model: input.model,
      instructions: input.system,
      input: input.user,
      text: { format: { type: "json_schema", name: "welcome_translations", strict: true, schema: input.schema } },
    });
    return parseJsonText(openAiText(response));
  }
  if (input.provider === "openrouter") {
    const response = await postProviderJson("https://openrouter.ai/api/v1/chat/completions", {
      Authorization: `Bearer ${input.apiKey}`,
      ...(input.siteUrl ? { "HTTP-Referer": input.siteUrl } : {}),
      "X-Title": "Hospitality Operations Admin",
    }, {
      model: input.model,
      messages: [{ role: "system", content: input.system }, { role: "user", content: input.user }],
      response_format: { type: "json_schema", json_schema: { name: "welcome_translations", strict: true, schema: input.schema } },
    });
    return parseJsonText(chatCompletionText(response));
  }
  if (input.provider === "anthropic") {
    const response = await postProviderJson("https://api.anthropic.com/v1/messages", {
      "x-api-key": input.apiKey,
      "anthropic-version": "2023-06-01",
    }, {
      model: input.model,
      max_tokens: 6_000,
      system: input.system,
      messages: [{ role: "user", content: input.user }],
    });
    return parseJsonText(anthropicText(response));
  }
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(input.model)}:generateContent`;
  const response = await postProviderJson(endpoint, { "x-goog-api-key": input.apiKey }, {
    systemInstruction: { parts: [{ text: input.system }] },
    contents: [{ role: "user", parts: [{ text: input.user }] }],
    generationConfig: { responseMimeType: "application/json", responseSchema: input.schema },
  });
  return parseJsonText(geminiText(response));
}
