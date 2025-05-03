import { OverviewItemCollection } from "./OverviewItemCollection";
import { useMemo, useState } from "react";
import { OverviewItem } from "./OverviewItem";
import {
  knownQueryParams,
  useActionUrlParams,
} from "../../../common/actions/searchParamHooks";
import { useEngravedHotkeys } from "../../../common/actions/useEngravedHotkeys";

export function useOverviewCollection() {
  const [focusIndex, setFocusIndex] = useState(-1);

  const { actionKey, itemId, setItemId } = useActionUrlParams();

  const collection = useMemo(() => {
    return new OverviewItemCollection(
      focusIndex,
      itemId,
      actionKey,
      onIndexChange,
    );

    function onIndexChange(itemId: string, index: number) {
      if (index === focusIndex) {
        return;
      }

      setFocusIndex(index);

      // todo: do we need this!?
      if (itemId && getSelectedItemIdFromUrl() !== itemId) {
        setItemId(null);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEngravedHotkeys("up", () => {
    collection.moveFocusUp();
  });

  useEngravedHotkeys("down", () => {
    collection.moveFocusDown();
  });

  if (itemId) {
    collection.setFocusForId(itemId);
  }

  if (actionKey) {
    collection.selectedActionKey = actionKey;
  }

  return {
    collection,
    addItem: (wrapper: OverviewItem) => collection.add(wrapper),
  };

  function getSelectedItemIdFromUrl() {
    return new URLSearchParams(location.search).get(
      knownQueryParams.selectedItemId,
    );
  }
}
