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
      if (hotkey === null) {
        callback(e);
        return;
      }

      const [modifier, key] = hotkey.split("+");

      if (modifier) {
        if (
          (modifier === "alt" && !e.altKey) ||
          (modifier === "ctrl" && !e.ctrlKey) ||
          (modifier === "meta" && !e.metaKey) ||
          (modifier === "shift" && !e.shiftKey)
        ) {
          return;
        }
      }

      if ((modifier && key !== e.key) || modifier !== key) {
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
