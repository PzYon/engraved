import { DependencyList } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export type Scopes = string | readonly string[];

export type KeyboardModifiers = {
  alt?: boolean;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  mod?: boolean;
  useKey?: boolean;
};

export type Hotkey = KeyboardModifiers & {
  keys?: readonly string[];
  scopes?: Scopes;
  description?: string;
  isSequence?: boolean;
};

export function useEngravedHotkeys(
  hotkey: string | string[],
  callback: (x: unknown, y: unknown) => void,
  options?: unknown | DependencyList,
  dependencies?: unknown | DependencyList,
) {
  useHotkeys(
    hotkey,
    (keyboardEvent: KeyboardEvent, hotkeysEvent: Hotkey) => {
      if (
        options &&
        (options as unknown as Record<string, unknown>).preventDefault ===
          undefined
      ) {
        keyboardEvent.preventDefault();
      }

      callback(keyboardEvent, hotkeysEvent);
    },
    options,
    dependencies,
  );
}
