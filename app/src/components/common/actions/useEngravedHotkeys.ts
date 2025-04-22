import { DependencyList } from "react";
import { HotkeyCallback, Options, useHotkeys } from "react-hotkeys-hook";

export function useEngravedHotkeys(
  hotkey: string,
  callback: HotkeyCallback,
  options?: Options | DependencyList,
  dependencies?: Options | DependencyList,
) {
  useHotkeys(
    hotkey,
    (keyboardEvent: KeyboardEvent, hotkeysEvent: unknown) => {
      keyboardEvent.preventDefault();

      callback(keyboardEvent, hotkeysEvent);
    },
    options,
    dependencies,
  );
}
