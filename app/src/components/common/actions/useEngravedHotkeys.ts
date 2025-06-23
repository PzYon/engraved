import { DependencyList } from "react";
import { HotkeyCallback, Options, useHotkeys } from "react-hotkeys-hook";
import { Hotkey } from "react-hotkeys-hook/dist/types";

export function useEngravedHotkeys(
  hotkey: string | string[],
  callback: HotkeyCallback,
  options?: unknown | DependencyList,
  dependencies?: unknown | DependencyList,
) {
  useHotkeys(
    hotkey,
    (keyboardEvent: KeyboardEvent, hotkeysEvent: Hotkey) => {
      if (options && (options as Options).preventDefault === undefined) {
        keyboardEvent.preventDefault();
      }

      callback(keyboardEvent, hotkeysEvent);
    },
    options,
    dependencies,
  );
}
