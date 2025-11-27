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
import { isRichTextEditor } from "../../common/isRichTextEditor";

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

  if (activeItemIdFromUrl && activeItemId !== activeItemIdFromUrl) {
    setActiveItemId(activeItemIdFromUrl);
  }

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

  //useEffect(() => () => setAppAlert(undefined), [setAppAlert]);

  const filteredItems = useMemo(
    () =>
      items.filter((f) => {
        if (inMemorySearchText) {
          return (
            ((f as IJournal).name || (f as IScrapEntry).title)
              ?.toLowerCase()
              .indexOf((inMemorySearchText ?? "").toLowerCase()) > -1
          );
        }

        return (showAll || filterItem?.(f)) ?? true;
      }),
    [showAll, filterItem, inMemorySearchText, items],
  );

  const getNextItem = useCallback(
    (direction: "up" | "down"): IEntity => {
      const activeIndex = filteredItems.findIndex(
        (item) => item.id === activeItemId,
      );
      const firstIndex = 0;
      const lastIndex = filteredItems.length - 1;

      return direction === "up"
        ? filteredItems[activeIndex > firstIndex ? activeIndex - 1 : lastIndex]
        : filteredItems[activeIndex < lastIndex ? activeIndex + 1 : firstIndex];
    },
    [filteredItems, activeItemId],
  );

  const removeItemParamsFromUrl = useCallback(() => {
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

  useEngravedHotkeys("*", (e) => {
    if (isRichTextEditor(e.target as HTMLElement)) {
      return;
    }

    switch (e.code) {
      case "ArrowUp": {
        e.preventDefault();
        removeItemParamsFromUrl();
        setActiveItemId(getNextItem("up")?.id);
        break;
      }

      case "ArrowDown": {
        e.preventDefault();
        removeItemParamsFromUrl();
        setActiveItemId(getNextItem("down")?.id);
        break;
      }

      default: {
        if (onKeyDown) {
          onKeyDown(e);
          return;
        }

        if (e.altKey || e.ctrlKey || e.shiftKey) {
          return;
        }

        if (e.key === "Escape") {
          setInMemorySearchText("");
          setActiveItemId(undefined);
          return;
        }

        if (e.key === "Backspace") {
          setInMemorySearchText((current) =>
            !current?.length
              ? current
              : current.substring(0, current.length - 1),
          );
          setActiveItemId(undefined);
        }

        if (e.key.match(/^\w$/) || e.key === " ") {
          setInMemorySearchText((current) => (current ?? "") + e.key);
          setActiveItemId(undefined);
          return;
        }
      }
    }
  });

  const contextValue = useMemo<IOverviewListContext>(
    () => ({
      activeItemId,
      setActiveItemId,
      itemsToShow: filteredItems,
      hiddenItemsCount: items.length - filteredItems.length,
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
      items.length,
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
