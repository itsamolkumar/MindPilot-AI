export function sanitizeText(value) {
  return String(value || "").trim().replace(/[\u0000-\x1f\x7f-\x9f]/g, "");
}

export function safePromptString(value) {
  return JSON.stringify(sanitizeText(value));
}
