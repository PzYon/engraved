import { IEntity } from "../../../serverApi/IEntity";
import { IAction } from "./IAction";

export function createItemScope(entity: IEntity): string {
  return `${entity.id}`;
}

export function wrapActionsForScope(
  actions: IAction[],
  scope: string,
): IAction[] {
  return actions.map((action) => ({ ...action, scope }));
}
