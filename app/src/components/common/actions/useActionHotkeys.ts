import { IAction } from "./IAction";
import { useNavigate } from "react-router-dom";
import { useHotkeys } from "react-hotkeys-hook";
import { executeActionClick } from "./ActionIconButton";

export const useActionHotkeys = (action: IAction) => {
  const navigate = useNavigate();

  useHotkeys(
    action.hotkey,
    (keyboardEvent) => {
      keyboardEvent.preventDefault();
      executeActionClick(null, action, navigate);
    },
    { enabled: !!action.hotkey }
  );
};
