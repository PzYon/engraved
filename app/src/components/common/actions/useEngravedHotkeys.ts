import { HotkeyCallback, useHotkeys } from "react-hotkeys-hook";
import {
  HotkeysEvent,
  OptionsOrDependencyArray,
} from "react-hotkeys-hook/dist/types";

export function useEngravedHotkeys(
  hotkey: string,
  callback: HotkeyCallback,
  options?: OptionsOrDependencyArray,
  dependencies?: OptionsOrDependencyArray,
) {
  useHotkeys(
    hotkey,
    (keyboardEvent: KeyboardEvent, hotkeysEvent: HotkeysEvent) => {
      keyboardEvent.preventDefault();

      callback(keyboardEvent, hotkeysEvent);
    },
    options,
    dependencies,
  );
}
