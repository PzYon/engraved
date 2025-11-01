import { DependencyList } from "react";
import { HotkeyCallback, Options, useHotkeys } from "react-hotkeys-hook";
import { isRichTextEditor } from "../isRichTextEditor";

export type Scopes = string | readonly string[];

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
  scopes?: Scopes;
  description?: string;
  isSequence?: boolean;
  hotkey: string;
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

      if (isRichTextEditor(keyboardEvent.target as HTMLElement)) {
        keyboardEvent.stopPropagation();
      }
    },
    { enableOnContentEditable: true, ...options },
    dependencies,
  );
}
