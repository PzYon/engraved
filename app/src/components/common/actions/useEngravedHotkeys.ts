import React, { useCallback, useEffect } from "react";

type KeyboardEventListener = (e: KeyboardEvent) => void;
type WrappedKeyboardEventListener = (e: KeyboardEvent) => boolean;

export class Manager {
  private registrations = new Map<
    React.RefObject<HTMLElement>,
    {
      callbacks: WrappedKeyboardEventListener[];
      executor: (e: KeyboardEvent) => void;
    }
  >();

  addListener(
    ref: React.RefObject<HTMLElement>,
    listener: WrappedKeyboardEventListener,
  ) {
    if (!this.registrations.has(ref)) {
      this.registrations.set(ref, {
        callbacks: [],
        executor: (e: KeyboardEvent): boolean => {
          console.log(e);

          let handled = false;

          for (const cb of this.registrations.get(ref)?.callbacks ?? []) {
            if (cb(e)) {
              handled = true;
            }
          }

          if (handled) {
            e.preventDefault();
          }

          return handled;
        },
      });

      const elementForEvent = ref === null ? document : ref?.current;
      elementForEvent.addEventListener(
        "keydown",
        this.registrations.get(ref).executor as EventListener,
      );
    }

    this.registrations.get(ref).callbacks.push(listener);
  }

  removeListener(
    ref: React.RefObject<HTMLElement>,
    listener: WrappedKeyboardEventListener,
  ) {
    this.registrations
      .get(ref)
      .callbacks.splice(
        this.registrations.get(ref).callbacks.indexOf(listener),
        1,
      );
  }
}

const manager = new Manager();

export function useEngravedHotkey(
  hotkey: string,
  ref: React.RefObject<HTMLElement>,
  callback: KeyboardEventListener,
  options?: {
    disabled?: boolean;
  },
) {
  const eventListener: WrappedKeyboardEventListener = useCallback(
    (e: KeyboardEvent): boolean => {
      if (hotkey === null) {
        callback(e);
        return true;
      }

      const { modifier, key } = parseHotkey(hotkey);

      if (
        modifier &&
        ((modifier === "alt" && !e.altKey) ||
          (modifier === "ctrl" && !e.ctrlKey) ||
          (modifier === "meta" && !e.metaKey) ||
          (modifier === "shift" && !e.shiftKey))
      ) {
        return false;
      }

      if (key !== e.key) {
        return false;
      }

      callback(e);
      return true;
    },
    [hotkey, callback],
  );

  useEffect(() => {
    if (options?.disabled || ref === undefined) {
      return;
    }

    manager.addListener(ref, eventListener);

    return () => manager.removeListener(ref, eventListener);
  }, [eventListener, options?.disabled, ref]);
}

function parseHotkey(hotkey: string): { modifier?: string; key?: string } {
  if (!hotkey || hotkey.indexOf("+") === -1) {
    return {
      key: hotkey,
    };
  }

  const [modifier, key] = hotkey.split("+");
  return { modifier: modifier, key: key };
}
