import { IAction } from "./IAction";
import { formatForDisplay } from "@tanstack/react-hotkeys";

export function getActionLabel(action: IAction) {
  return action.label + (action.hotkey ? ` (${getTooltipLabel(action)})` : "");
}

function getTooltipLabel(action: IAction) {
  return formatForDisplay(action.hotkey, {
    separatorToken: "+",
    useSymbols: false,
  });
}
