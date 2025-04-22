import { DependencyList } from "react";
import { HotkeyCallback, Options, useHotkeys } from "react-hotkeys-hook";

interface Hotkey {
  keys?: readonly string[];
  scopes?: string | readonly string[];
  description?: string;
}

export function useEngravedHotkeys(
  hotkey: string,
  callback: HotkeyCallback,
  options?: Options | DependencyList,
  dependencies?: Options | DependencyList,
) {
  useHotkeys(
    hotkey,
    (keyboardEvent: KeyboardEvent, hotkeysEvent: Hotkey) => {
      keyboardEvent.preventDefault();

      callback(keyboardEvent, hotkeysEvent);
    },
    options,
    dependencies,
  );
}
