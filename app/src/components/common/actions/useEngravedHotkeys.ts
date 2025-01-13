import { HotkeyCallback, useHotkeys } from "react-hotkeys-hook";
import {
  HotkeysEvent,
  OptionsOrDependencyArray,
} from "react-hotkeys-hook/dist/types";

const pressedKeys: Record<string, { timer?: number; count: number }> = {};
const requiredCountTimeMs = 200;

export function useEngravedHotkeys(
  keys: string,
  callback: HotkeyCallback,
  options?: OptionsOrDependencyArray,
  dependencies?: OptionsOrDependencyArray,
  requiredCount = 0,
) {
  useHotkeys(
    keys,
    (keyboardEvent: KeyboardEvent, hotkeysEvent: HotkeysEvent) => {
      keyboardEvent.preventDefault();

      const unregister = handleRequiredCount(keys, requiredCount);
      if (unregister) {
        return unregister;
      }

      return callback(keyboardEvent, hotkeysEvent);
    },
    options,
    dependencies,
  );
}

function handleRequiredCount(
  hotkey: string,
  requiredCount: number,
): () => void | null {
  if (
    requiredCount > 1 &&
    (pressedKeys[hotkey]?.count ?? 0) < requiredCount - 1
  ) {
    count(hotkey);
    setTimer(hotkey);

    return () => clearTimer(hotkey);
  }

  clearPressedKeys(hotkey);

  return null;
}

function clearTimer(hotkey: string) {
  window.clearTimeout(pressedKeys[hotkey].timer);
}

function setTimer(hotkey: string) {
  clearTimer(hotkey);

  pressedKeys[hotkey].timer = window.setTimeout(() => {
    clearPressedKeys(hotkey);
  }, requiredCountTimeMs);
}

function clearPressedKeys(hotkey: string) {
  delete pressedKeys[hotkey];
}

function count(hotkey: string) {
  if (!pressedKeys[hotkey]) {
    pressedKeys[hotkey] = { count: 0 };
  }

  pressedKeys[hotkey].count++;
}
