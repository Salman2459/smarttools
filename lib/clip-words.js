/**
 * Trims text to a maximum word count (adds ellipsis when truncated).
 * @param {string} text
 * @param {number} maxWords
 */
export function clipWords(text, maxWords) {
  const words = text.trim().split(/\s+/).filter(Boolean)
  if (words.length <= maxWords) return text.trim()
  return `${words.slice(0, maxWords).join(" ")}…`
}

/** Editorial target for tool blurbs in `tool-extended-copy.js` */
export const TOOL_PAGE_DESCRIPTION_MIN_WORDS = 50
/** Hard cap for any description shown on `/tools/[toolId]` (hero, guide summary, sidebar). */
export const TOOL_PAGE_DESCRIPTION_MAX_WORDS = 100

/**
 * Slug pages: never show more than {@link TOOL_PAGE_DESCRIPTION_MAX_WORDS} words.
 * Copy in `tool-extended-copy` should stay between MIN and MAX words for quality.
 * @param {string} text
 */
export function clipToolPageDescription(text) {
  if (!text || typeof text !== "string") return ""
  return clipWords(text.trim(), TOOL_PAGE_DESCRIPTION_MAX_WORDS)
}
