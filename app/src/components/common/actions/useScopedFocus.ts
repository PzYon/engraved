import { useEffect } from "react";
import { useHotkeysContext } from "react-hotkeys-hook";

/**
 * Hook to enable/disable a hotkey scope based on whether an element has focus.
 * Use this to limit hotkeys to only work when a specific list item or component is active.
 *
 * @param scope - The scope name to enable/disable
 * @param hasFocus - Whether the element currently has focus
 *
 * @example
 * ```tsx
 * function ListItem({ item, hasFocus }) {
 *   const scope = `item-${item.id}`;
 *   useScopedFocus(scope, hasFocus);
 *
 *   const actions = [
 *     { key: 'edit', hotkey: 'alt+e', scope, onClick: () => edit() },
 *     { key: 'delete', hotkey: 'alt+d', scope, onClick: () => delete() }
 *   ];
 *
 *   return <div>{...}</div>;
 * }
 * ```
 */
export function useScopedFocus(scope: string | string[], hasFocus: boolean) {
  const { enableScope, disableScope } = useHotkeysContext();

  useEffect(() => {
    if (!scope) {
      return;
    }

    const scopes = Array.isArray(scope) ? scope : [scope];

    if (hasFocus) {
      scopes.forEach((s) => enableScope(s));
    } else {
      scopes.forEach((s) => disableScope(s));
    }

    return () => {
      scopes.forEach((s) => disableScope(s));
    };
  }, [scope, hasFocus, enableScope, disableScope]);
}
