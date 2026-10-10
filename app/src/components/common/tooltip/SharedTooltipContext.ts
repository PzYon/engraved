import React, { createContext, useContext, useEffect, useId } from "react";
import { SharedTooltipStore } from "./SharedTooltipStore";

export const SharedTooltipContext = createContext<
  SharedTooltipStore | undefined
>(undefined);

// Returns the props that make an element show the app's one tooltip, when it
// is hovered, long-pressed or reached with the keyboard. Without a
// SharedTooltipProvider above it there is no tooltip.
export function useSharedTooltip(title: string) {
  const store = useContext(SharedTooltipContext);
  const ownerId = useId();

  useEffect(() => {
    store?.setTitle(ownerId, title);
  }, [store, ownerId, title]);

  useEffect(() => () => store?.remove(ownerId), [store, ownerId]);

  return {
    onPointerEnter: (e: React.PointerEvent<HTMLElement>) =>
      store?.show(ownerId, e.currentTarget, title, isTouch(e)),
    onPointerLeave: (e: React.PointerEvent<HTMLElement>) =>
      store?.hide(ownerId, isTouch(e)),
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      // Not for the focus an element gets by being clicked.
      if (e.target.matches(":focus-visible")) {
        store?.show(ownerId, e.currentTarget, title, false);
      }
    },
    onBlur: () => store?.hide(ownerId, false),
  };
}

function isTouch(e: React.PointerEvent) {
  return e.pointerType === "touch";
}
