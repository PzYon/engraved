import {
  HotkeyCallback,
  HotkeyOptions,
  RegisterableHotkey,
  useHotkey,
} from "@tanstack/react-hotkeys";

const fallbackHotkey: RegisterableHotkey = "Control+Alt+Shift+M";

export function useEngravedHotkeysNew(
  hotkey: RegisterableHotkey,
  callback: HotkeyCallback,
  options?: HotkeyOptions,
) {
  return useHotkey(hotkey ?? fallbackHotkey, callback, options);
}
