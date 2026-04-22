import {
  HotkeyCallback,
  HotkeyOptions,
  RegisterableHotkey,
  useHotkey,
} from "@tanstack/react-hotkeys";

export function useEngravedHotkeysNew(
  hotkey: RegisterableHotkey,
  callback: HotkeyCallback,
  options?: HotkeyOptions,
) {
  return useHotkey(hotkey, callback, options);
}
