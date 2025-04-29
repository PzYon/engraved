import { OverviewItemCollection } from "./OverviewItemCollection";
import { useEffect, useMemo, useState } from "react";
import { OverviewItem } from "./OverviewItem";
import {
  knownQueryParams,
  useSelectedItemId,
} from "../../../common/actions/searchParamHooks";
import { useEngravedHotkeys } from "../../../common/actions/useEngravedHotkeys";

export function useOverviewCollection() {
  const [focusIndex, setFocusIndex] = useState(-1);

  const { setValue, getValue } = useSelectedItemId();

  const collection = useMemo(() => {
    return new OverviewItemCollection(focusIndex, onIndexChange);

    function onIndexChange(itemId: string, index: number) {
      if (index === focusIndex) {
        return;
      }

      setFocusIndex(index);

      if (itemId && getSelectedItemIdFromUrl() !== itemId) {
        setValue(null);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusIndex]);

  useEngravedHotkeys("up", () => {
    collection.moveFocusUp();
  });

  useEngravedHotkeys("down", () => {
    collection.moveFocusDown();
  });

  const itemId = getValue();

  useEffect(() => {
    if (itemId) {
      collection.setFocusForId(itemId);
    }
  }, [collection, itemId]);

  return {
    collection,
    addItem: (wrapper: OverviewItem) => collection.add(wrapper),
  };

  function getSelectedItemIdFromUrl() {
    return new URLSearchParams(location.search).get(
      knownQueryParams.selectedItemIdParam,
    );
  }
}
