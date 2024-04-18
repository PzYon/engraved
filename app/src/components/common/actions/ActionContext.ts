import { IAction } from "./IAction";
import { createContext, useContext } from "react";

export interface IActionContext {
  addAction(action: IAction): void;
  removeAction(action: IAction): void;
}

export const ActionContext = createContext<IActionContext>({
  addAction: null,
  removeAction: null,
});

export const useActionContext = () => {
  return useContext(ActionContext);
};
