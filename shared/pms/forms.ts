export function formText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function optionalFormText(formData: FormData, name: string): string | undefined {
  const value = formText(formData, name);
  return value || undefined;
}

export function optionalFormNumber(formData: FormData, name: string): number | undefined {
  const value = formText(formData, name);
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function formBoolean(formData: FormData, name: string): boolean {
  const value = formData.get(name);
  return value === "on" || value === "true" || value === "1";
}
