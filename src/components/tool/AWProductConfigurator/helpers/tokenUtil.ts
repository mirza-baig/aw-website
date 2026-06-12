export function isExpiringSoon(expiresRfc1123: string, windowMinutes = 30): boolean {
  // Parse date with format like "Mon, 05 Jan 2026 22:36:50 GMT" -> Date
  const expiresAt = new Date(expiresRfc1123);

  if (Number.isNaN(expiresAt.getTime())) {
    // If parsing fails, treat as expiring soon
    return true;
  }

  const now = Date.now();
  const windowMs = windowMinutes * 60 * 1000;
  const timeLeftMs = expiresAt.getTime() - now;

  return timeLeftMs <= windowMs;
}
