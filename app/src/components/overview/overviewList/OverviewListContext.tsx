import { createContext, useContext } from "react";
import { IEntity } from "../../../serverApi/IEntity";

export interface IOverviewListContext {
  keepFocusAtIndex(): void;
  activeItemId: string;
  setActiveItemId: (id: string) => void;
  itemsToShow: IEntity[];
  hiddenItemsCount: number;
  removeItemParamsFromUrl: () => void;
  setShowAll: (value: boolean) => void;
}

export const OverviewListContext = createContext<IOverviewListContext>({
  keepFocusAtIndex: null!,
  activeItemId: null!,
  setActiveItemId: null!,
  itemsToShow: null!,
  hiddenItemsCount: null!,
  removeItemParamsFromUrl: null!,
  setShowAll: null!,
});

export const useOverviewListContext = () => {
  return useContext(OverviewListContext);
};
