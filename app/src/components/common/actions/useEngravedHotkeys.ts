import { DependencyList } from "react";
import { HotkeyCallback, useHotkeys } from "react-hotkeys-hook";

export function useEngravedHotkeys(
  hotkey: string,
  callback: HotkeyCallback,
  options?: unknown | DependencyList,
  dependencies?: unknown | DependencyList,
) {
  useHotkeys(
    hotkey,
    (
      keyboardEvent: KeyboardEvent,
      hotkeysEvent: {
        keys?: readonly string[];
        scopes?: string | readonly string[];
        description?: string;
      },
    ) => {
      keyboardEvent.preventDefault();

      callback(keyboardEvent, hotkeysEvent);
    },
    options,
    dependencies,
  );
}
