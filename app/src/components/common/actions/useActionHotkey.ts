import { createSearchParams, useNavigate } from "react-router-dom";
import { IAction } from "./IAction";
import { useHotkeys } from "react-hotkeys-hook";

const pressedKeys: Record<string, { timer?: number; count: number }> = {};

export const useActionHotkey = (action: IAction) => {
  const navigate = useNavigate();

  const isAbsoluteUrl = action.href?.startsWith("http");

  useHotkeys(
    action.hotkey,
    (keyboardEvent) => {
      keyboardEvent.preventDefault();

      const unregister = handleActionRequiredCount(action);
      if (unregister) {
        return unregister;
      }

      navigate({
        pathname: action.href,
        search: createSearchParams(action.search).toString(),
      });
    },
    {
      enabled:
        !isAbsoluteUrl &&
        !!action.hotkey &&
        !!(action.href || Object.keys(action.search ?? {}).length),
      enableOnFormTags: ["textarea", "input"],
    },
  );
};

function handleActionRequiredCount(action: IAction): () => void | null {
  if (
    action.hotkeyRequiredCount > 1 &&
    (pressedKeys[action.hotkey]?.count ?? 0) < action.hotkeyRequiredCount - 1
  ) {
    count(action);
    setTimer(action);

    return () => clearTimer(action);
  }

  clearPressedKeys(action);

  return null;
}

function clearTimer(action: IAction) {
  window.clearTimeout(pressedKeys[action.hotkey].timer);
}

function setTimer(action: IAction) {
  clearTimer(action);

  pressedKeys[action.hotkey].timer = window.setTimeout(() => {
    clearPressedKeys(action);
  }, 300);
}

function clearPressedKeys(action: IAction) {
  delete pressedKeys[action.hotkey];
}

function count(action: IAction) {
  if (!pressedKeys[action.hotkey]) {
    pressedKeys[action.hotkey] = { count: 0 };
  }

  pressedKeys[action.hotkey].count++;
}
