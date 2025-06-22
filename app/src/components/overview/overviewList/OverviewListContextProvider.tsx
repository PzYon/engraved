import React, { useCallback, useMemo } from "react";
import { IEntity } from "../../../serverApi/IEntity";
import { OverviewListContext } from "./OverviewListContext";

export const OverviewListContextProvider: React.FC<{
  items: IEntity[];
  children: React.ReactNode;
}> = ({ items, children }) => {
  const [activeItemId, setActiveItemId] = React.useState<string>(undefined);

  const getNextItem = React.useCallback(
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

  const moveDown = useCallback(() => {
    setActiveItemId(getNextItem("down")?.id);
  }, [getNextItem, setActiveItemId]);

  const moveUp = useCallback(() => {
    setActiveItemId(getNextItem("up")?.id);
  }, [getNextItem, setActiveItemId]);

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
