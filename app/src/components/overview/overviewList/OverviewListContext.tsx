import { createContext, useContext } from "react";

interface IOverviewListContext {
  activeItemId: string;
  setActiveItemId: (id: string) => void;
  moveDown: () => void;
  moveUp: () => void;
}

export const OverviewListContext = createContext<IOverviewListContext>({
  activeItemId: undefined,
  setActiveItemId: undefined,
  moveUp: undefined,
  moveDown: undefined,
});

export const useOverviewListContext = () => {
  return useContext(OverviewListContext);
};
