import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { isRichTextEditor } from "../../common/isRichTextEditor";

export const OverviewListContextProvider: React.FC<{
  items: IEntity[];
  filterItem?: (item: IEntity) => boolean;
  onKeyDown?: (e: KeyboardEvent) => void;
  onActiveItemChange?: (activeItemId: string | undefined) => void;
  children: React.ReactNode;
}> = ({ items, children, filterItem, onKeyDown, onActiveItemChange }) => {
  const { setAppAlert } = useAppContext();

  const [activeItemId, setActiveItemId] = React.useState<string | undefined>(
    undefined,
  );
  const [showAll, setShowAll] = useState(false);

  const navigate = useNavigate();
  const searchString = useRouterState({
    select: (s): string => s.location.searchStr,
  });
  const searchParams = useMemo(
    () => new URLSearchParams(searchString),
    [searchString],
  );

  const activeItemIdFromUrl = searchParams.get(knownQueryParams.selectedItemId);
  const containerRef = useRef<HTMLDivElement>(null);

  if (activeItemIdFromUrl && activeItemId !== activeItemIdFromUrl) {
    setActiveItemId(activeItemIdFromUrl);
  }

  useEffect(() => {
    onActiveItemChange?.(activeItemId);
  }, [activeItemId, onActiveItemChange]);

  // undefined is the initial value, afterward it is ""
  const [inMemorySearchText, setInMemorySearchText] =
    useState<string | undefined>(undefined);

  useEffect(() => {
    if (inMemorySearchText) {
      setAppAlert({
        title: inMemorySearchText,
        message: "",
        type: "info",
        hideDurationSec: undefined,
      });
    } else if (inMemorySearchText === "") {
      setAppAlert(null);
    }
  }, [inMemorySearchText, setAppAlert]);

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

    const newParams = new URLSearchParams(searchString);
    newParams.delete(knownQueryParams.selectedItemId);
    newParams.delete(knownQueryParams.actionKey);
    navigate({
      to: ".",
      search: () => Object.fromEntries(newParams),
      replace: true,
    });
  }, [searchParams, searchString, navigate]);

  useEngravedHotkeys("*", (e) => {
    if (isRichTextEditor(e.target as HTMLElement)) {
      return;
    }

    if (!containerRef.current?.contains(e.target as Node) && activeItemId) {
      return;
    }

    switch (e.code) {
      case "ArrowUp": {
        e.preventDefault();
        removeItemParamsFromUrl();
        setActiveItemId(getNextItem("up")?.id ?? "");
        break;
      }

      case "ArrowDown": {
        e.preventDefault();
        removeItemParamsFromUrl();
        setActiveItemId(getNextItem("down")?.id ?? "");
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
      activeItemId: activeItemId ?? "",
      setActiveItemId,
      itemsToShow: filteredItems,
      hiddenItemsCount: items.length - filteredItems.length,
      removeItemParamsFromUrl,
      setShowAll: (value: boolean) => {
        setShowAll(value);
        setInMemorySearchText("");
      },
      keepFocusAtIndex: () => {
        const newParams = new URLSearchParams(searchString);
        newParams.delete(knownQueryParams.selectedItemId);

        const currentItemIndex = items.findIndex((i) => i.id === activeItemId);
        const previousItemId = items[currentItemIndex + 1]?.id ?? "";

        navigate({
          to: ".",
          search: () => Object.fromEntries(newParams),
          replace: true,
        });
        setActiveItemId(previousItemId);
      },
    }),
    [
      activeItemId,
      setActiveItemId,
      filteredItems,
      items,
      removeItemParamsFromUrl,
      setShowAll,
      searchString,
      navigate,
    ],
  );

  return (
    <OverviewListContext.Provider value={contextValue}>
      <div ref={containerRef}>{children}</div>
    </OverviewListContext.Provider>
  );
};
