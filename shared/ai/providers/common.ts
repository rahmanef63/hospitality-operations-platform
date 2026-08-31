const MAX_PROVIDER_RESPONSE_BYTES = 220_000;

export async function postProviderJson(url: string, headers: Record<string, string>, body: unknown): Promise<unknown> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(45_000),
  });
  const text = await response.text();
  if (new TextEncoder().encode(text).byteLength > MAX_PROVIDER_RESPONSE_BYTES) throw new Error("AI provider response is too large.");
  if (!response.ok) throw new Error(`AI provider request failed with status ${response.status}.`);
  try { return JSON.parse(text) as unknown; } catch { throw new Error("AI provider returned invalid JSON."); }
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

export function openAiText(payload: unknown): string {
  const root = asRecord(payload);
  if (typeof root?.output_text === "string") return root.output_text;
  const output = Array.isArray(root?.output) ? root.output : [];
  return output.flatMap((item) => {
    const content = Array.isArray(asRecord(item)?.content) ? asRecord(item)!.content as unknown[] : [];
    return content.map((part) => asRecord(part)?.text).filter((text): text is string => typeof text === "string");
  }).join("");
}

export function chatCompletionText(payload: unknown): string {
  const choices = Array.isArray(asRecord(payload)?.choices) ? asRecord(payload)!.choices as unknown[] : [];
  const content = asRecord(asRecord(choices[0])?.message)?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map((item) => asRecord(item)?.text).filter((text): text is string => typeof text === "string").join("");
  return "";
}

export function anthropicText(payload: unknown): string {
  const content = Array.isArray(asRecord(payload)?.content) ? asRecord(payload)!.content as unknown[] : [];
  return content.map((item) => asRecord(item)?.text).filter((text): text is string => typeof text === "string").join("");
}

export function geminiText(payload: unknown): string {
  const candidates = Array.isArray(asRecord(payload)?.candidates) ? asRecord(payload)!.candidates as unknown[] : [];
  const parts = Array.isArray(asRecord(asRecord(candidates[0])?.content)?.parts)
    ? asRecord(asRecord(candidates[0])?.content)!.parts as unknown[]
    : [];
  return parts.map((item) => asRecord(item)?.text).filter((text): text is string => typeof text === "string").join("");
}

export function parseJsonText(text: string): unknown {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  if (!cleaned) throw new Error("AI provider returned an empty response.");
  try { return JSON.parse(cleaned) as unknown; } catch { throw new Error("AI provider output did not match the required JSON format."); }
}
