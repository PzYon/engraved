import { DependencyList } from "react";
import { HotkeyCallback, Options, useHotkeys } from "react-hotkeys-hook";

type KeyboardModifiers = {
  alt?: boolean;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  mod?: boolean;
  useKey?: boolean;
};

type Hotkey = KeyboardModifiers & {
  keys?: readonly string[];
  scopes?: string | readonly string[];
  description?: string;
  isSequence?: boolean;
};

export function useEngravedHotkeys(
  hotkey: string | string[],
  callback: HotkeyCallback,
  options?: Options | DependencyList,
  dependencies?: Options | DependencyList,
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
