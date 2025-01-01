import { useHotkeys } from "react-hotkeys-hook";
import { OverviewItemCollection } from "./OverviewItemCollection";
import { useEffect, useMemo, useState } from "react";
import { OverviewItem } from "./OverviewItem";
import {
  knownQueryParams,
  useSelectedItemId,
} from "../../../common/actions/searchParamHooks";

export function useOverviewCollection(doNotUseUrl: boolean) {
  const [focusIndex, setFocusIndex] = useState(-1);

  const { setValue, getValue } = useSelectedItemId();

  const collection = useMemo(() => {
    return new OverviewItemCollection(focusIndex, onIndexChange);

    function onIndexChange(itemId: string, index: number) {
      setFocusIndex(index);
      if (!doNotUseUrl && itemId && getSelectedItemIdFromUrl() !== itemId) {
        setValue(itemId);
      }
    }
  }, [focusIndex]);

  useHotkeys("alt+up", () => collection.moveFocusUp());
  useHotkeys("alt+down", () => collection.moveFocusDown());

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
