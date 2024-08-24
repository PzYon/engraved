import { useHotkeys } from "react-hotkeys-hook";
import { OverviewItemCollection } from "./OverviewItemCollection";
import { useEffect, useState } from "react";
import { OverviewItem } from "./OverviewItem";
import {
  knownQueryParams,
  useSelectedItemId,
} from "../../../common/actions/searchParamHooks";

export function useOverviewCollection() {
  const [focusIndex, setFocusIndex] = useState(-1);

  const { setValue, getValue } = useSelectedItemId();

  const collection = new OverviewItemCollection(focusIndex, onIndexChange);

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

  function onIndexChange(itemId: string, index: number) {
    setFocusIndex(index);
    if (itemId && getSelectedItemIdFromUrl() !== itemId) {
      setValue(itemId);
    }
  }

  function getSelectedItemIdFromUrl() {
    return new URLSearchParams(location.search).get(
      knownQueryParams.selectedItemIdParam,
    );
  }
}
