// Utility functions for dropdown label formatting

export interface DropdownItem {
  id: string;
  name: string;
}

/**
 * Formats dropdown label to fit in single line with character limit
 * @param items - Array of selected items
 * @param maxChars - Maximum characters for the entire label (default: 30)
 * @returns Formatted label string that fits in one line
 */
export const formatDropdownLabel = (items: DropdownItem[], maxChars: number = 30): string => {
  if (!items || items.length === 0) return '';
  
  if (items.length === 1) {
    // Single item - truncate if too long
    return items[0].name.length > maxChars 
      ? items[0].name.substring(0, maxChars - 3) + '...'
      : items[0].name;
  }
  
  // Multiple items - show count instead of names to keep it short
  return `${items.length} items selected`;
};

/**
 * Gets full tooltip text showing all selected items
 * @param items - Array of selected items
 * @returns Full list of item names for tooltip
 */
export const getFullTooltipText = (items: DropdownItem[]): string => {
  if (!items || items.length === 0) return '';
  return items.map(item => item.name).join(', ');
};

/**
 * Truncates individual item names if they're too long
 * @param name - Item name to truncate
 * @param maxLength - Maximum length for individual names (default: 20)
 * @returns Truncated name with ellipsis if needed
 */
export const truncateItemName = (name: string, maxLength: number = 20): string => {
  if (!name || name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + '...';
};