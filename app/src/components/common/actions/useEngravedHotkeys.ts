import React, { useCallback, useEffect } from "react";

/*
open points:
- improve types for hotkey
- do we really need to register an event receiver on every element? or could we
  - register only one globally a somehow check "target"
  - or register only one PER element and check "target" there
 */

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
