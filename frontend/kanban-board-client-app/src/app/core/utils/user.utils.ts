import { UserInstance } from '../models/classes/UserInstance';

/**
 * Gets the display name for a user with fallback logic
 * @param user - The user instance
 * @returns The display name or empty string if no user
 */
export function getUserDisplayName(user: UserInstance | null): string {
  if (!user) return '';

  // Use displayName if available, fallback to name, then to username
  return user.displayName || user.name || user.username || '';
}

/**
 * Gets the initials for a user based on their display name or name
 * @param user - The user instance
 * @returns The user initials or '?' if no valid name found
 */
export function getUserInitials(user: UserInstance | null): string {
  if (!user) return '?';

  // Use displayName for initials if available, fallback to name
  const displayName = user.displayName || user.name;
  if (!displayName) return '?';

  const names = displayName
    .trim()
    .split(' ')
    .filter(name => name.length > 0);

  if (names.length === 0) return '?';
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }

  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}
