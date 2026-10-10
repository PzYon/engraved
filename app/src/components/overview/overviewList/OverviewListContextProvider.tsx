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
import { useAppContext } from "../../../AppContext";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { isRichTextEditor } from "../../common/isRichTextEditor";
import { filterOverviewItems } from "./filterOverviewItems";

// Returns a function that takes the selected item and its action out of the
// URL, which closes an open action panel.
function useRemoveItemParamsFromUrl(searchParams: URLSearchParams) {
  const navigate = useNavigate();

  // Kept in a ref, as reading it must not make the callback below depend on
  // the URL - see the comment in there.
  const hasItemParams =
    searchParams.has(knownQueryParams.selectedItemId) ||
    searchParams.has(knownQueryParams.actionKey);

  const hasItemParamsRef = useRef(hasItemParams);

  useEffect(() => {
    hasItemParamsRef.current = hasItemParams;
  }, [hasItemParams]);

  return useCallback(() => {
    // This is called on every move of the focus, and nearly always there is
    // nothing to remove. Navigating to where we already are is not free
    // though: the router goes through a complete load, and everything that
    // follows its state renders along.
    if (!hasItemParamsRef.current) {
      return;
    }

    navigate({
      to: ".",
      replace: true,
      resetScroll: false,
      // Functional updater: compute from the router's current search instead of
      // closing over searchString. This keeps the callback (and the memoized
      // context value below) stable across search changes, so updating these
      // params doesn't re-render the whole list.
      search: (prev) => {
        if (
          !prev[knownQueryParams.selectedItemId] &&
          !prev[knownQueryParams.actionKey]
        ) {
          return prev;
        }

        const next = { ...prev };
        delete next[knownQueryParams.selectedItemId];
        delete next[knownQueryParams.actionKey];
        return next;
      },
    });
  }, [navigate]);
}

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
  const [inMemorySearchText, setInMemorySearchText] = useState<
    string | undefined
  >(undefined);

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
    () => filterOverviewItems(items, inMemorySearchText, showAll, filterItem),
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

  const removeItemParamsFromUrl = useRemoveItemParamsFromUrl(searchParams);

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
        const currentItemIndex = items.findIndex((i) => i.id === activeItemId);
        const previousItemId = items[currentItemIndex + 1]?.id ?? "";

        navigate({
          to: ".",
          replace: true,
          resetScroll: false,
          search: (prev) => {
            const next = { ...prev };
            delete next[knownQueryParams.selectedItemId];
            return next;
          },
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
      navigate,
    ],
  );

  return (
    <OverviewListContext.Provider value={contextValue}>
      <div ref={containerRef}>{children}</div>
    </OverviewListContext.Provider>
  );
};
