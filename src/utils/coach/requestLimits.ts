/**
 * Bounds on what a single coach request may send to the Claude API.
 * They keep token usage (and cost) predictable if the app is deployed publicly.
 */
export const MAX_QUESTION_LENGTH = 2000;
export const MAX_HISTORY_MESSAGES = 20;
export const MAX_HISTORY_MESSAGE_LENGTH = 4000;
export const MAX_CONTEXT_BYTES = 200_000;

export type ChatHistoryMessage = { role: "user" | "assistant"; content: string };

/** Keeps only well-formed messages, the most recent ones, each truncated. */
export function sanitizeHistory(history: unknown): ChatHistoryMessage[] {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter(
      (entry): entry is ChatHistoryMessage =>
        typeof entry === "object" &&
        entry !== null &&
        (entry.role === "user" || entry.role === "assistant") &&
        typeof entry.content === "string"
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((entry) => ({
      role: entry.role,
      content: entry.content.slice(0, MAX_HISTORY_MESSAGE_LENGTH)
    }));
}

export function isContextTooLarge(context: unknown): boolean {
  return JSON.stringify(context ?? null).length > MAX_CONTEXT_BYTES;
}
