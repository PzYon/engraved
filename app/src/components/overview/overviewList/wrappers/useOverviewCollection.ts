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

  const collection = new OverviewItemCollection(
    focusIndex,
    setFocusIndex,
    (id) => {
      if (id && getSelectedItemIdFromUrl() !== id) {
        setValue(id);
      }
    },
  );

  const itemId = getValue();

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

  function getSelectedItemIdFromUrl() {
    return new URLSearchParams(location.search).get(
      knownQueryParams.selectedItemIdParam,
    );
  }
}
