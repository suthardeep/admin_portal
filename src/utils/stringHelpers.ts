/**
 * Generates initials from a full name
 * @param name - Full name (e.g., "John Doe Smith")
 * @returns Initials in uppercase (e.g., "JDS")
 * @example
 * getInitials("John Doe") // "JD"
 * getInitials("A B C") // "ABC"
 * getInitials("") // ""
 */
export const getInitials = (name: string): string => {
  if (!name || name.trim() === '') return '';

  return name
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

/**
 * Converts a string to proper case with space separation
 * Handles camelCase, snake_case, and lowercase strings
 * @param str - String to convert
 * @returns Properly cased string with spaces
 * @example
 * toProperCase("brandowner") // "Brand Owner"
 * toProperCase("manufacture") // "Manufacture"
 * toProperCase("imported") // "Imported"
 * toProperCase("brand_owner") // "Brand Owner"
 */
export const toProperCase = (str: string): string => {
  if (!str || str.trim() === '') return '';

  // Handle camelCase by adding space before capital letters
  const withSpaces = str.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Replace underscores and hyphens with spaces
  const cleaned = withSpaces.replace(/[_-]/g, ' ');

  // Capitalize first letter of each word
  return cleaned
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
