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

      if (
        action.hotkeyRequiredCount > 1 &&
        (pressedKeys[action.hotkey]?.count ?? 0) <
          action.hotkeyRequiredCount - 1
      ) {
        if (!pressedKeys[action.hotkey]) {
          pressedKeys[action.hotkey] = { count: 0 };
        }

        pressedKeys[action.hotkey].count++;

        window.clearTimeout(pressedKeys[action.hotkey].timer);

        pressedKeys[action.hotkey].timer = window.setTimeout(() => {
          delete pressedKeys[action.hotkey];
        }, 300);

        return () => {
          window.clearTimeout(pressedKeys[action.hotkey].timer);
        };
      }

      delete pressedKeys[action.hotkey];

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
