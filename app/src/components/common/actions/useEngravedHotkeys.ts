import React, { useCallback, useEffect } from "react";

export function useEngravedHotkey(
  hotkey: string,
  ref: React.RefObject<HTMLElement>,
  callback: (e: KeyboardEvent) => void,
  options?: {
    disabled?: boolean;
  },
) {
  const cb = useCallback(
    (e: KeyboardEvent) => {
      console.log(e);

      if (hotkey === "Enter" && e.key === "Enter") {
        debugger;
      }

      if (hotkey === null) {
        callback(e);
        return;
      }

      const { modifier, key } = parseHotkey(hotkey);

      if (
        modifier &&
        ((modifier === "alt" && !e.altKey) ||
          (modifier === "ctrl" && !e.ctrlKey) ||
          (modifier === "meta" && !e.metaKey) ||
          (modifier === "shift" && !e.shiftKey))
      ) {
        return;
      }

      if (key !== e.key) {
        return;
      }

      callback(e);
    },
    [hotkey, callback],
  );

  useEffect(() => {
    if (options?.disabled) {
      return;
    }

    const current = ref === null ? document : ref?.current;
    current?.addEventListener("keydown", cb as never);

    return () => current?.removeEventListener("keydown", cb as never);
  }, [cb, options?.disabled, ref]);
}

function parseHotkey(hotkey: string): { modifier?: string; key?: string } {
  if (hotkey.indexOf("+") === -1) {
    return {
      key: hotkey,
    };
  }

  const [modifier, key] = hotkey.split("+");
  return { modifier: modifier, key: key };
}
