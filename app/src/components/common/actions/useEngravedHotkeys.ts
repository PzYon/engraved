import React, { useCallback, useEffect } from "react";

type KeyboardEventListener = (e: KeyboardEvent) => void;
type WrappedKeyboardEventListener = (e: KeyboardEvent) => boolean;

export class Manager {
  private registrations = new Map<
    React.RefObject<HTMLElement>,
    {
      listeners: {
        eventListener: WrappedKeyboardEventListener;
        hotkey: string;
      }[];
      executor: (e: KeyboardEvent) => void;
    }
  >();

  addListener(
    ref: React.RefObject<HTMLElement>,
    hotkey: string,
    listener: WrappedKeyboardEventListener,
  ) {
    if (ref && !ref.current) {
      return false;
    }

    if (!this.registrations.has(ref)) {
      this.registrations.set(ref, {
        listeners: [],
        executor: (e: KeyboardEvent): boolean => {
          const obj = this.registrations.get(ref);

          console.log(e, hotkey, obj);

          let handled = false;

          for (const listener of obj?.listeners ?? []) {
            if (listener.eventListener(e)) {
              handled = true;
            }
          }

          if (handled) {
            e.preventDefault();
          }

          if (
            !handled &&
            ((e.target as HTMLElement).nodeName.toLowerCase() === "input" ||
              (e.target as HTMLElement).nodeName.toLowerCase() === "textarea")
          ) {
            e.stopPropagation();
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

    this.registrations.get(ref).listeners.push({
      eventListener: listener,
      hotkey: hotkey,
    });
  }

  removeListener(
    ref: React.RefObject<HTMLElement>,
    listener: WrappedKeyboardEventListener,
  ) {
    const instance = this.registrations
      .get(ref)
      ?.listeners.find((l) => l.eventListener === listener);

    if (!instance) {
      return;
    }

    this.registrations
      .get(ref)
      .listeners.splice(
        this.registrations.get(ref).listeners.indexOf(instance),
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

    manager.addListener(ref, hotkey, eventListener);

    return () => manager.removeListener(ref, eventListener);
  }, [eventListener, options?.disabled, ref, hotkey]);
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
