import { IAction } from "./IAction";
import { createContext, useContext } from "react";

export interface IActionContext {
  addAction(action: IAction): void;
  removeAction(action: IAction): void;
  getAllRegisteredActions(): IAction[];
}

export const ActionContext = createContext<IActionContext>({
  addAction: null,
  removeAction: null,
  getAllRegisteredActions: null,
});

export const useActionContext = () => {
  return useContext(ActionContext);
};
