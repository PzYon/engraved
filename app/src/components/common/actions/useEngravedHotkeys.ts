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
      debugger;
      if (hotkey === null) {
        callback(e);
        return;
      }

      if (!e.altKey) {
        return;
      }

      if (hotkey.split("+")[1] !== e.key) {
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
