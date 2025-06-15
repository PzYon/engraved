import React, { useCallback, useMemo } from "react";
import { IEntity } from "../../../serverApi/IEntity";
import { useEngravedHotkeys } from "../../common/actions/useEngravedHotkeys";
import { OverviewListContext } from "./OverviewListContext";

export const OverviewListContextProvider: React.FC<{
  items: IEntity[];
  children: React.ReactNode;
}> = ({ items, children }) => {
  const [activeItemId, setActiveItemId] = React.useState<string>(undefined);

  const getItem = React.useCallback(
    (direction: "up" | "down"): IEntity => {
      const activeIndex = items.findIndex((item) => item.id === activeItemId);
      const firstIndex = 0;
      const lastIndex = items.length - 1;

      return direction === "up"
        ? items[activeIndex > firstIndex ? activeIndex - 1 : lastIndex]
        : items[activeIndex < lastIndex ? activeIndex + 1 : firstIndex];
    },
    [items, activeItemId],
  );

  const moveDown = useCallback(
    () => setActiveItemId(getItem("down")?.id),
    [getItem, setActiveItemId],
  );

  const moveUp = useCallback(
    () => setActiveItemId(getItem("up")?.id),
    [getItem, setActiveItemId],
  );

  useEngravedHotkeys("ArrowUp", () => moveUp());
  useEngravedHotkeys("ArrowDown", () => moveDown());

  const contextValue = useMemo(
    () => ({
      activeItemId,
      setActiveItemId,
      moveDown,
      moveUp,
    }),
    [activeItemId, setActiveItemId, moveDown, moveUp],
  );

  return (
    <OverviewListContext.Provider value={contextValue}>
      {children}
    </OverviewListContext.Provider>
  );
};
