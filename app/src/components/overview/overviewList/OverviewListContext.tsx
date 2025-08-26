import { createContext, useContext } from "react";
import { IEntity } from "../../../serverApi/IEntity";

export interface IOverviewListContext {
  activeItemId: string;
  setActiveItemId: (id: string) => void;
  itemsToShow: IEntity[];
  hiddenItemsCount: number;
  removeItemParamsFromUrl: () => void;
  setShowAll: (value: boolean) => void;
}

export const OverviewListContext = createContext<IOverviewListContext>({
  activeItemId: undefined,
  setActiveItemId: undefined,
  itemsToShow: undefined,
  hiddenItemsCount: undefined,
  removeItemParamsFromUrl: undefined,
  setShowAll: undefined,
});

export const useOverviewListContext = () => {
  return useContext(OverviewListContext);
};
