export function resolveTimezone(clientTimezone?: string): string {
  if (clientTimezone) return clientTimezone;

  try {
    return 'Asia/Kolkata';
  } catch {
    return 'Asia/Kolkata';
  }
}
