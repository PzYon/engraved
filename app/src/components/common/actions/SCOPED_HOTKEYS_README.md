# Scoped Hotkeys

This feature allows you to limit keyboard shortcuts to specific components or list items, ensuring that hotkeys only work when the target element is active/focused.

## The Problem

Without scoping, when you have a list of items with the same hotkeys:

- Pressing `Alt+E` to edit will trigger the edit action on **all** items
- You cannot target just the currently focused item
- Global hotkeys can conflict with component-specific hotkeys

## The Solution

Scoped hotkeys allow you to:

- Assign a unique scope to each list item or component
- Enable/disable scopes based on focus state
- Ensure hotkeys only work on the active element

## Quick Start

### 1. Import Required Utilities

```typescript
import { createItemScope } from "../common/actions/scopeUtils";
import { useScopedFocus } from "../common/actions/useScopedFocus";
```

### 2. Create a Scope in Your Component

```typescript
function JournalListItem({ journal, hasFocus }) {
  // Create a unique scope for this item
  const scope = createItemScope("journal", journal.id);

  // Enable/disable scope based on focus
  useScopedFocus(scope, hasFocus);

  // ...rest of component
}
```

### 3. Add Scope to Your Actions

```typescript
const actions = [
  {
    key: 'edit',
    label: 'Edit',
    icon: <EditOutlined />,
    hotkey: 'alt+e',
    scope: scope,  // <-- Add this!
    onClick: () => handleEdit(),
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: <DeleteOutlined />,
    hotkey: 'alt+d',
    scope: scope,  // <-- Add this!
    onClick: () => handleDelete(),
  }
];
```

## Complete Example

See `JournalListItem.EXAMPLE.tsx` for a complete example of how to update an existing component.

## API Reference

### `IAction`

The `IAction` interface now includes an optional `scope` property:

```typescript
interface IAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  hotkey?: string;
  scope?: string | string[]; // <-- New property
  onClick?: () => void;
  // ...other properties
}
```

### `useScopedFocus(scope, hasFocus)`

Hook to enable/disable a scope based on focus state.

**Parameters:**

- `scope: string | string[]` - The scope name(s) to manage
- `hasFocus: boolean` - Whether the element currently has focus

**Example:**

```typescript
useScopedFocus("journal-123", hasFocus);
```

### `createItemScope(itemType, itemId)`

Create a unique scope string for a list item.

**Parameters:**

- `itemType: string` - The type of item (e.g., 'journal', 'entry')
- `itemId: string` - The unique ID of the item

**Returns:** `string` - A scope string like `"journal-abc123"`

**Example:**

```typescript
const scope = createItemScope("journal", journal.id);
// Returns: "journal-abc123"
```

### `createComponentScope(componentType)`

Create a scope string for a component type.

**Parameters:**

- `componentType: string` - The type/name of the component

**Returns:** `string` - A scope string

**Example:**

```typescript
const scope = createComponentScope("edit-mode");
// Returns: "scope-edit-mode"
```

### `CommonScopes`

Common scope constants:

```typescript
const CommonScopes = {
  GLOBAL: "*", // Always active
  EDIT_MODE: "edit-mode",
  VIEW_MODE: "view-mode",
};
```

## Multiple Scopes

You can assign multiple scopes to an action:

```typescript
const action = {
  key: "save",
  hotkey: "alt+s",
  scope: ["edit-mode", itemScope], // Works in both scopes
  onClick: () => save(),
};
```

## Global Hotkeys

To keep a hotkey global (not scoped), simply omit the `scope` property:

```typescript
const action = {
  key: "refresh",
  hotkey: "alt+r",
  // No scope - works globally
  onClick: () => refresh(),
};
```

## Migration Guide

To add scoped hotkeys to an existing component:

1. **Add the scope to your list item component:**

   ```typescript
   const scope = createItemScope("journal", journal.id);
   useScopedFocus(scope, hasFocus);
   ```

2. **Update action factory methods to accept scope:**

   ```typescript
   static editJournal(
     journalId: string,
     enableHotkey: boolean,
     scope?: string | string[],  // Add this parameter
   ): IAction {
     return {
       hotkey: enableHotkey ? "alt+e" : undefined,
       scope: scope,  // Use the scope
       // ...rest of action
     };
   }
   ```

3. **Pass scope when creating actions:**
   ```typescript
   const actions = [
     ActionFactory.editJournal(journal.id, hasFocus, scope),
     ActionFactory.deleteJournal(journal.id, hasFocus, scope),
   ];
   ```

## How It Works

The scoped hotkeys feature is built on `react-hotkeys-hook`'s scope system:

1. **Each scope is a named context** that can be enabled or disabled
2. **`useScopedFocus` hook** enables a scope when `hasFocus` is true, and disables it when false
3. **Hotkeys with a scope** only trigger when that scope is enabled
4. **Hotkeys without a scope** work globally

This ensures that when you navigate between list items:

- The previous item's scope is disabled
- The new item's scope is enabled
- Only the focused item's hotkeys will work

## Testing

To verify scoped hotkeys are working:

1. Create a list with multiple items that have the same hotkeys
2. Navigate to one item (it should have focus)
3. Press a hotkey (e.g., `Alt+E`)
4. Verify that only the focused item's action is triggered

## Additional Resources

- `SCOPED_HOTKEYS_GUIDE.ts` - Detailed implementation guide
- `JournalListItem.EXAMPLE.tsx` - Complete example implementation
- `scopeUtils.ts` - Utility functions for working with scopes
