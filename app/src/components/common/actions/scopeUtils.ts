/**
 * Utilities for working with scoped hotkeys in list items and components.
 *
 * Scoped hotkeys allow you to limit keyboard shortcuts to only work when a specific
 * element or list item is active/focused. This is useful for actions that should
 * only apply to the currently selected item in a list.
 */

/**
 * Create a scope string for a specific item.
 * Use this to create consistent scope names for list items.
 *
 * @param itemType - The type of item (e.g., 'journal', 'entry', 'scrap')
 * @param itemId - The unique ID of the item
 * @returns A scope string like "journal-abc123"
 *
 * @example
 * const scope = createItemScope('journal', journal.id);
 * // returns "journal-abc123"
 */
export function createItemScope(itemType: string, itemId: string): string {
  return `${itemType}-${itemId}`;
}

/**
 * Create a scope string for a component type.
 * Use this for scoping hotkeys to component instances (like edit mode).
 *
 * @param componentType - The type/name of the component
 * @returns A scope string
 *
 * @example
 * const scope = createComponentScope('edit-mode');
 * // returns "scope-edit-mode"
 */
export function createComponentScope(componentType: string): string {
  return `scope-${componentType}`;
}

/**
 * Common scope constants for use across the application
 */
export const CommonScopes = {
  /** Global scope - always active */
  GLOBAL: "*",
  /** Edit mode scope */
  EDIT_MODE: "edit-mode",
  /** View mode scope */
  VIEW_MODE: "view-mode",
} as const;
