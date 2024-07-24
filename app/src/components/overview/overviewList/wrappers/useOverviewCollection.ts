import { useHotkeys } from "react-hotkeys-hook";
import { OverviewItemCollection } from "./OverviewItemCollection";
import { useEffect, useMemo, useState } from "react";
import { OverviewItem } from "./OverviewItem";
import {
  knownQueryParams,
  useSelectedItemId,
} from "../../../common/actions/itemActionHook";

export function useOverviewCollection(deps: unknown[]) {
  const [focusIndex, setFocusIndex] = useState(-1);

  const { setSelectedItemId, getSelectedItemId } = useSelectedItemId();

  const itemId = getSelectedItemId();

  const collection = useMemo(
    () =>
      new OverviewItemCollection(focusIndex, setFocusIndex, (x) => {
        if (
          new URLSearchParams(location.search).get(
            knownQueryParams.selectedItemIdParam,
          ) !== x
        ) {
          setSelectedItemId(x);
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps],
  );

  useEffect(() => {
    if (itemId) {
      collection.setFocusForId(itemId);
    }
  }, [collection, itemId]);

  useHotkeys("alt+up", () => {
    collection.moveFocusUp();
  });

  useHotkeys("alt+down", () => {
    collection.moveFocusDown();
  });

  return {
    collection,
    addItem: (wrapper: OverviewItem) => collection.add(wrapper),
  };
}
