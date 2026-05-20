export const ADMIN_EMAILS = new Set([
  'mgarc350@gmail.com',
  'garciamervin33@gmail.com',
  'compatoonsofficial@gmail.com',
]);

export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.has(email.toLowerCase().trim());
}
