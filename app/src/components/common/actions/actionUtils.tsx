import { IAction } from "./IAction";

export function getActionLabel(action: IAction) {
  return action.label + (action.hotkey ? ` (${getTooltipLabel(action)})` : "");
}

function getTooltipLabel(action: IAction) {
  return action.hotkeyRequiredCount
    ? `${action.hotkeyRequiredCount}x ${action.hotkey}`
    : action.hotkey;
}
