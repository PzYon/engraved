import { useSyncExternalStore } from "react";
import { focusManager } from "@tanstack/react-query";

const autoUpdateIntervalSeconds = 30;

// A single, shared ticker for all relative time labels (see FormatDate.tsx).
// Instead of every component instance registering its own setInterval, they all
// subscribe to this one loop. The interval is started lazily when the first
// auto-updating subscriber appears and stopped again once the last one
// unsubscribes, so it only runs while there is actually something on screen
// that needs updating.
//
// Additionally, all subscribers (auto-updating or not) are refreshed when the
// window regains focus. This uses TanStack Query's focusManager, i.e. the same
// event that triggers the check for a new app version (see VersionChecker.tsx),
// so labels that went stale while the app was in the background are corrected
// right away.

type Listener = () => void;

const autoUpdateListeners = new Set<Listener>();
const focusOnlyListeners = new Set<Listener>();
let intervalId: number | undefined;
let unsubscribeFromFocus: (() => void) | undefined;
let now = Date.now();

const notify = (listeners: Iterable<Listener>) => {
  now = Date.now();
  for (const listener of listeners) {
    listener();
  }
};

const onFocusChange = (isFocused: boolean) => {
  if (isFocused) {
    notify([...autoUpdateListeners, ...focusOnlyListeners]);
  }
};

const startOrStopListening = () => {
  if (autoUpdateListeners.size > 0 && intervalId === undefined) {
    intervalId = window.setInterval(
      () => notify(autoUpdateListeners),
      autoUpdateIntervalSeconds * 1000,
    );
  } else if (autoUpdateListeners.size === 0 && intervalId !== undefined) {
    window.clearInterval(intervalId);
    intervalId = undefined;
  }

  const hasListeners = autoUpdateListeners.size + focusOnlyListeners.size > 0;

  if (hasListeners && !unsubscribeFromFocus) {
    unsubscribeFromFocus = focusManager.subscribe(onFocusChange);
  } else if (!hasListeners && unsubscribeFromFocus) {
    unsubscribeFromFocus();
    unsubscribeFromFocus = undefined;
  }
};

const createSubscribe = (listeners: Set<Listener>) => (listener: Listener) => {
  listeners.add(listener);
  startOrStopListening();

  return () => {
    listeners.delete(listener);
    startOrStopListening();
  };
};

const subscribeWithAutoUpdate = createSubscribe(autoUpdateListeners);
const subscribeOnFocusOnly = createSubscribe(focusOnlyListeners);

const getSnapshot = () => now;

// Returns a value that changes whenever the consuming component should refresh
// its relative time label: on every shared tick when `autoUpdate` is true, and
// whenever the window regains focus.
export const useNow = (autoUpdate = true): number => {
  return useSyncExternalStore(
    autoUpdate ? subscribeWithAutoUpdate : subscribeOnFocusOnly,
    getSnapshot,
  );
};
