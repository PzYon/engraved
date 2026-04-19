/**
 * SCOPED HOTKEYS - USAGE GUIDE
 *
 * This guide explains how to use scoped hotkeys to limit keyboard shortcuts
 * to specific list items or components.
 *
 * ============================================================================
 * PROBLEM:
 * ============================================================================
 * When you have a list of items with hotkeys (e.g., Alt+E to edit, Alt+D to delete),
 * without scoping, pressing the hotkey will trigger the action on ALL items in the list
 * that have the same hotkey defined. This is not what you want.
 *
 * ============================================================================
 * SOLUTION:
 * ============================================================================
 * Use scoped hotkeys to ensure that shortcuts only work on the currently focused/active item.
 *
 * ============================================================================
 * STEP 1: Define a scope for your actions
 * ============================================================================
 *
 * import { createItemScope } from "../common/actions/scopeUtils";
 *
 * function JournalListItem({ journal, hasFocus }) {
 *   // Create a unique scope for this journal item
 *   const scope = createItemScope('journal', journal.id);
 *
 *   // ... rest of your component
 * }
 *
 * ============================================================================
 * STEP 2: Enable/disable the scope based on focus
 * ============================================================================
 *
 * import { useScopedFocus } from "../common/actions/useScopedFocus";
 *
 * function JournalListItem({ journal, hasFocus }) {
 *   const scope = createItemScope('journal', journal.id);
 *
 *   // This hook will enable the scope when hasFocus is true,
 *   // and disable it when hasFocus is false
 *   useScopedFocus(scope, hasFocus);
 *
 *   // ... rest of your component
 * }
 *
 * ============================================================================
 * STEP 3: Add the scope to your actions
 * ============================================================================
 *
 * function JournalListItem({ journal, hasFocus }) {
 *   const scope = createItemScope('journal', journal.id);
 *   useScopedFocus(scope, hasFocus);
 *
 *   const actions = [
 *     {
 *       key: 'edit',
 *       label: 'Edit',
 *       icon: <EditOutlined />,
 *       hotkey: 'alt+e',
 *       scope: scope,  // <-- Add the scope here!
 *       onClick: () => handleEdit(),
 *     },
 *     {
 *       key: 'delete',
 *       label: 'Delete',
 *       icon: <DeleteOutlined />,
 *       hotkey: 'alt+d',
 *       scope: scope,  // <-- Add the scope here!
 *       onClick: () => handleDelete(),
 *     }
 *   ];
 *
 *   return (
 *     <ListItemFooterRow
 *       hasFocus={hasFocus}
 *       properties={properties}
 *       actions={actions}
 *     />
 *   );
 * }
 *
 * ============================================================================
 * COMPLETE EXAMPLE
 * ============================================================================
 *
 * import React from "react";
 * import { IJournal } from "../../../serverApi/IJournal";
 * import { ActionFactory } from "../../common/actions/ActionFactory";
 * import { createItemScope } from "../../common/actions/scopeUtils";
 * import { useScopedFocus } from "../../common/actions/useScopedFocus";
 * import { ListItemFooterRow } from "../ListItemFooterRow";
 *
 * export const JournalListItem: React.FC<{
 *   journal: IJournal;
 *   hasFocus: boolean;
 * }> = ({ journal, hasFocus }) => {
 *   // 1. Create a scope for this item
 *   const scope = createItemScope('journal', journal.id);
 *
 *   // 2. Enable/disable scope based on focus
 *   useScopedFocus(scope, hasFocus);
 *
 *   // 3. Create actions with the scope
 *   const actions = [
 *     ActionFactory.editJournal(journal.id, hasFocus, scope),
 *     ActionFactory.deleteJournal(journal.id, hasFocus, scope),
 *   ];
 *
 *   return (
 *     <div>
 *       <h3>{journal.name}</h3>
 *       <ListItemFooterRow
 *         hasFocus={hasFocus}
 *         properties={getJournalProperties(journal)}
 *         actions={actions}
 *       />
 *     </div>
 *   );
 * };
 *
 * ============================================================================
 * UPDATING ACTION FACTORY METHODS
 * ============================================================================
 *
 * You'll need to update your ActionFactory methods to accept an optional scope parameter:
 *
 * static editJournal(
 *   journalId: string,
 *   enableHotkey: boolean,
 *   scope?: string | string[]
 * ): IAction {
 *   return {
 *     hotkey: enableHotkey ? "alt+e" : undefined,
 *     scope: scope,  // <-- Add this
 *     key: "edit",
 *     label: "Edit journal",
 *     icon: <EditOutlined fontSize="small" />,
 *     search: getItemActionQueryParams("edit", journalId),
 *   };
 * }
 *
 * ============================================================================
 * MULTIPLE SCOPES
 * ============================================================================
 *
 * You can also use multiple scopes for an action:
 *
 * const actions = [
 *   {
 *     key: 'save',
 *     hotkey: 'alt+s',
 *     scope: ['edit-mode', itemScope],  // <-- Works in both scopes
 *     onClick: () => save(),
 *   }
 * ];
 *
 * ============================================================================
 * GLOBAL HOTKEYS
 * ============================================================================
 *
 * Some hotkeys should work globally (not scoped to a specific item).
 * Just don't add a scope property, or set it to undefined:
 *
 * const actions = [
 *   {
 *     key: 'refresh',
 *     hotkey: 'alt+r',
 *     // No scope - works globally
 *     onClick: () => refresh(),
 *   }
 * ];
 *
 * ============================================================================
 * TESTING
 * ============================================================================
 *
 * To test that scoping is working:
 * 1. Create a list with multiple items that have the same hotkey
 * 2. Navigate to one item (give it focus)
 * 3. Press the hotkey
 * 4. Verify that only the focused item's action is triggered
 */

// This file is for documentation purposes only
export {};
