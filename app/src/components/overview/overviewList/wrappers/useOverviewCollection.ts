import { OverviewItemCollection } from "./OverviewItemCollection";
import { useEffect, useMemo, useState } from "react";
import { OverviewItem } from "./OverviewItem";
import {
  knownQueryParams,
  useSelectedActionKey,
  useSelectedItemId,
} from "../../../common/actions/searchParamHooks";
import { useEngravedHotkeys } from "../../../common/actions/useEngravedHotkeys";

export function useOverviewCollection() {
  const [focusIndex, setFocusIndex] = useState(-1);

  const { setValue: setItemId, getValue: getItemId } = useSelectedItemId();

  const { getValue: getActionKey } = useSelectedActionKey();

  const collection = useMemo(() => {
    return new OverviewItemCollection(
      getItemId(),
      getActionKey(),
      onIndexChange,
    );

    function onIndexChange(itemId: string, index: number) {
      if (index === focusIndex) {
        return;
      }

      setFocusIndex(index);

      if (itemId && getSelectedItemIdFromUrl() !== itemId) {
        setItemId(null);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusIndex, getItemId(), getActionKey()]);

  useEngravedHotkeys("up", () => {
    collection.moveFocusUp();
  });

  useEngravedHotkeys("down", () => {
    collection.moveFocusDown();
  });

  const itemId = getItemId();

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
