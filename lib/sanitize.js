export function sanitizeText(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\x1f\x7f-\x9f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function safePromptString(value) {
  return JSON.stringify(sanitizeText(value));
}
