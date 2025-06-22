import React, { useCallback, useMemo } from "react";
import { IEntity } from "../../../serverApi/IEntity";
import { useEngravedHotkeys } from "../../common/actions/useEngravedHotkeys";
import { OverviewListContext } from "./OverviewListContext";
import { knownQueryParams } from "../../common/actions/searchParamHooks";
import { useSearchParams } from "react-router-dom";

export const OverviewListContextProvider: React.FC<{
  items: IEntity[];
  children: React.ReactNode;
}> = ({ items, children }) => {
  const [activeItemId, setActiveItemId] = React.useState<string>(undefined);

  const [searchParams, setSearchParams] = useSearchParams();

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

  useEngravedHotkeys("ArrowUp", (e) => {
    e.preventDefault();
    removeItemIdFromUrl();
    moveUp();
  });

  useEngravedHotkeys("ArrowDown", (e) => {
    e.preventDefault();
    removeItemIdFromUrl();
    moveDown();
  });

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

  function removeItemIdFromUrl() {
    if (!searchParams.get(knownQueryParams.selectedItemId)) {
      return;
    }

    searchParams.delete(knownQueryParams.selectedItemId);
    setSearchParams(searchParams);
  }
};
