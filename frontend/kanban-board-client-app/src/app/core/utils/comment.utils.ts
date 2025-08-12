/**
 * Parses a mentions string into an array of normalized mentions.
 * Accepts comma or whitespace-separated values. Ensures each mention starts with '@'.
 */
export function parseMentions(mentions?: string | null): string[] {
  if (!mentions) return [];

  return mentions
    .split(/[\s,]+/g)
    .map(token => token.trim())
    .filter(token => token.length > 0)
    .map(token => (token.startsWith('@') ? token : `@${token}`));
}
