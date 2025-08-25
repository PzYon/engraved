import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IEntity } from "../../../serverApi/IEntity";
import {
  IOverviewListContext,
  OverviewListContext,
} from "./OverviewListContext";
import { knownQueryParams } from "../../common/actions/searchParamHooks";
import { useEngravedHotkeys } from "../../common/actions/useEngravedHotkeys";
import { IJournal } from "../../../serverApi/IJournal";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { useAppContext } from "../../../AppContext";
import { useSearchParams } from "react-router";

export const OverviewListContextProvider: React.FC<{
  items: IEntity[];
  filterItem?: (item: IEntity) => boolean;
  onKeyDown?: (e: KeyboardEvent) => void;
  children: React.ReactNode;
}> = ({ items, children, filterItem, onKeyDown }) => {
  const { setAppAlert } = useAppContext();

  const [activeItemId, setActiveItemId] = React.useState<string>(undefined);

  const [showAll, setShowAll] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeItemIdFromUrl = searchParams.get(knownQueryParams.selectedItemId);

  useEffect(() => {
    if (activeItemIdFromUrl && activeItemId !== activeItemIdFromUrl) {
      setActiveItemId(activeItemIdFromUrl);
    }
  }, [activeItemId, activeItemIdFromUrl, setActiveItemId]);

  // undefined is the initial value, afterward it is ""
  const [inMemorySearchText, setInMemorySearchText] =
    useState<string>(undefined);

  useEffect(() => {
    if (inMemorySearchText) {
      setAppAlert({
        title: inMemorySearchText,
        message: "",
        type: "info",
        hideDurationSec: null,
      });
    } else if (inMemorySearchText === "") {
      setAppAlert(undefined);
    }
  }, [inMemorySearchText, setAppAlert]);

  const removeItemParamsFromUrl = React.useCallback(() => {
    if (
      !searchParams.get(knownQueryParams.selectedItemId) &&
      !searchParams.get(knownQueryParams.actionKey)
    ) {
      return;
    }

    searchParams.delete(knownQueryParams.selectedItemId);
    searchParams.delete(knownQueryParams.actionKey);
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

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

  useEngravedHotkeys("*", (e) => {
    switch (e.code) {
      case "ArrowUp": {
        e.preventDefault();
        removeItemParamsFromUrl();
        moveUp();
        break;
      }

      case "ArrowDown": {
        e.preventDefault();
        removeItemParamsFromUrl();
        moveDown();
        break;
      }

      default: {
        if (e.altKey || e.ctrlKey || e.shiftKey) {
          // todo: is this correct? what about onKeyDown?
          return;
        }

        if (onKeyDown) {
          onKeyDown?.(e);
          return;
        }

        if (e.key.match(/^\w$/) || e.key === " ") {
          setInMemorySearchText((current) => (current ?? "") + e.key);
          return;
        }

        if (e.key === "Backspace") {
          setInMemorySearchText((current) =>
            !current?.length
              ? current
              : current.substring(0, current.length - 1),
          );
        }
      }
    }
  });

  const filteredItems = items.filter(
    (f) =>
      (((showAll || filterItem?.(f)) ?? true) && !inMemorySearchText) ||
      (f as IJournal).name
        ?.toLowerCase()
        .indexOf(inMemorySearchText.toLowerCase()) > -1 ||
      (f as IScrapEntry).title
        ?.toLowerCase()
        .indexOf(inMemorySearchText.toLowerCase()) > -1,
  );

  const hiddenItems = items.length - filteredItems.length;

  const contextValue = useMemo<IOverviewListContext>(
    () => ({
      activeItemId,
      setActiveItemId,
      itemsToShow: filteredItems,
      hiddenItems,
      removeItemParamsFromUrl,
      setShowAll: (value: boolean) => {
        setShowAll(value);
        setInMemorySearchText("");
      },
    }),
    [
      activeItemId,
      setActiveItemId,
      filteredItems,
      hiddenItems,
      removeItemParamsFromUrl,
      setShowAll,
    ],
  );

  return (
    <OverviewListContext.Provider value={contextValue}>
      {children}
    </OverviewListContext.Provider>
  );
};
