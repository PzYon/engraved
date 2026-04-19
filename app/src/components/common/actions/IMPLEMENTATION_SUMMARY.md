# Scoped Hotkeys Implementation - Summary

## What Was Implemented

A complete scoped hotkeys system for the Engraved app, allowing keyboard shortcuts to be limited to specific list items or components based on focus state.

## Files Created/Modified

### Core Implementation Files

1. **IAction.ts** (Modified)
   - Added `scope?: string | string[]` property to the IAction interface
   - Allows actions to specify which scope(s) they belong to

2. **useEngravedHotkeys.ts** (Modified)
   - Updated to properly handle the `scopes` option from react-hotkeys-hook
   - Fixed options handling to support both Options object and DependencyList

3. **ActionIconButton.tsx** (Modified)
   - Now passes the `scope` from IAction to useEngravedHotkeys
   - Ensures hotkeys are registered with their associated scope

4. **ActionLink.tsx** (Modified)
   - Now passes the `scope` from IAction to useEngravedHotkeys
   - Ensures navigation hotkeys respect scopes

### Utility Files

5. **useScopedFocus.ts** (New)
   - Hook to enable/disable a scope based on focus state
   - Automatically manages scope lifecycle with cleanup
   - Usage: `useScopedFocus(scope, hasFocus)`

6. **scopeUtils.ts** (New)
   - Helper functions for creating consistent scope names
   - `createItemScope(itemType, itemId)` - for list items
   - `createComponentScope(componentType)` - for components
   - `CommonScopes` - predefined scope constants

### Documentation Files

7. **SCOPED_HOTKEYS_README.md** (New)
   - Complete user guide for the scoped hotkeys feature
   - API reference for all functions and types
   - Quick start guide and examples

8. **SCOPED_HOTKEYS_GUIDE.ts** (New)
   - Detailed implementation guide with step-by-step instructions
   - Shows how to update existing components
   - Includes complete code examples

9. **JournalListItem.EXAMPLE.tsx** (New)
   - Practical example showing how to update JournalListItem
   - Demonstrates all steps needed to add scoping to an existing component
   - Includes comments explaining what needs to change in related files

10. **ScopedHotkeysDemo.tsx** (New)
    - Interactive demo component for testing scoped hotkeys
    - Shows a list of items with scoped actions
    - Includes action log to verify correct behavior

## How It Works

### The Problem

Without scoping, when you have multiple list items with the same hotkey (e.g., Alt+E for edit):

- Pressing the hotkey triggers ALL items' actions
- No way to target just the focused item
- Potential for unintended actions

### The Solution

With scoped hotkeys:

1. Each list item gets a unique scope (e.g., `"journal-123"`)
2. The `useScopedFocus` hook enables the scope when the item has focus
3. Actions with that scope only work when the scope is enabled
4. When focus moves, the old scope is disabled and the new one is enabled

### Implementation Pattern

```typescript
function ListItem({ item, hasFocus }) {
  // 1. Create scope
  const scope = createItemScope('item', item.id);

  // 2. Enable/disable based on focus
  useScopedFocus(scope, hasFocus);

  // 3. Add scope to actions
  const actions = [
    {
      key: 'edit',
      hotkey: 'alt+e',
      scope: scope,  // <-- This is the key!
      onClick: () => edit(),
    }
  ];

  return <ListItemFooterRow actions={actions} />;
}
```

## Migration Guide

To add scoped hotkeys to an existing list component:

### Step 1: Update List Item Component

```typescript
import { createItemScope } from "../common/actions/scopeUtils";
import { useScopedFocus } from "../common/actions/useScopedFocus";

const scope = createItemScope("journal", journal.id);
useScopedFocus(scope, hasFocus);
```

### Step 2: Update Action Creation

Pass the scope to your action factory methods:

```typescript
const actions = getCommonJournalActions(journal, hasFocus, user, scope);
```

### Step 3: Update Action Factory

Add scope parameter to factory methods:

```typescript
static editJournal(
  journalId: string,
  enableHotkey: boolean,
  scope?: string | string[],  // <-- Add this
): IAction {
  return {
    hotkey: enableHotkey ? "alt+e" : undefined,
    scope: scope,  // <-- Use this
    // ...rest
  };
}
```

## Benefits

1. **Prevents Unintended Actions**: Only the focused item responds to hotkeys
2. **Better UX**: Predictable behavior - hotkeys work on what you're looking at
3. **Flexible**: Support for multiple scopes, global hotkeys, and component-level scoping
4. **Type-Safe**: Full TypeScript support with proper types
5. **Easy to Use**: Simple API with helper functions

## Testing

Use the `ScopedHotkeysDemo` component to test the implementation:

1. Add it to a route in your app
2. Click different items to give them focus
3. Press Alt+E or Alt+D
4. Verify only the focused item responds

## Next Steps

To use this in your app:

1. **Start with one component** - Try updating JournalListItem first
2. **Update ActionFactory** - Add scope parameters to methods
3. **Update action getters** - Pass scopes through helper functions
4. **Test thoroughly** - Use the demo component and manual testing
5. **Roll out gradually** - Update other list components as needed

## Technical Details

- Built on top of `react-hotkeys-hook` v5.2.4
- Uses the library's native scope system
- No breaking changes to existing code
- Backward compatible - scopes are optional
- Works with both function-based and URL-based actions

## Support

See the following files for detailed information:

- `SCOPED_HOTKEYS_README.md` - User guide and API reference
- `SCOPED_HOTKEYS_GUIDE.ts` - Detailed implementation guide
- `JournalListItem.EXAMPLE.tsx` - Complete working example
- `ScopedHotkeysDemo.tsx` - Interactive demo/test component
