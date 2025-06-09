import { HotkeyCallback, useHotkeys } from "react-hotkeys-hook";
import {
  HotkeysEvent,
  Options,
  OptionsOrDependencyArray,
} from "react-hotkeys-hook/dist/types";

export function useEngravedHotkeys(
  hotkey: string | string[],
  callback: HotkeyCallback,
  options?: OptionsOrDependencyArray,
  dependencies?: OptionsOrDependencyArray,
) {
  useHotkeys(
    hotkey,
    (keyboardEvent: KeyboardEvent, hotkeysEvent: HotkeysEvent) => {
      if (options && (options as Options).preventDefault === undefined) {
        keyboardEvent.preventDefault();
      }

      callback(keyboardEvent, hotkeysEvent);
    },
    options,
    dependencies,
  );
}
