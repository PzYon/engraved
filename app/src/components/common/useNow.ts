import { useSyncExternalStore } from "react";

const autoUpdateIntervalSeconds = 30;

// A single, shared ticker for all relative time labels (see FormatDate.tsx).
// Instead of every component instance registering its own setInterval, they all
// subscribe to this one loop. The interval is started lazily when the first
// subscriber appears and stopped again once the last one unsubscribes, so it
// only runs while there is actually something on screen that needs updating.

type Listener = () => void;

const listeners = new Set<Listener>();
let intervalId: number | undefined;
let now = Date.now();

const tick = () => {
  now = Date.now();
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: Listener) => {
  listeners.add(listener);

  if (intervalId === undefined) {
    intervalId = window.setInterval(tick, autoUpdateIntervalSeconds * 1000);
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0 && intervalId !== undefined) {
      window.clearInterval(intervalId);
      intervalId = undefined;
    }
  };
};

const getSnapshot = () => now;

const noopSubscribe = () => () => {};
const getDisabledSnapshot = () => 0;

// Returns a value that changes on every shared tick, causing the consuming
// component to re-render. When `enabled` is false the component does not
// subscribe at all (and never re-renders because of the ticker).
export const useNow = (enabled = true): number => {
  return useSyncExternalStore(
    enabled ? subscribe : noopSubscribe,
    enabled ? getSnapshot : getDisabledSnapshot,
  );
};
