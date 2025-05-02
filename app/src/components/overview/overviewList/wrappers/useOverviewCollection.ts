import { OverviewItemCollection } from "./OverviewItemCollection";
import { useMemo, useState } from "react";
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
      focusIndex,
      getItemId(),
      getActionKey(),
      onIndexChange,
    );

    function onIndexChange(itemId: string, index: number) {
      if (index === focusIndex) {
        return;
      }

      setFocusIndex(index);

      // todo: do we need this!?
      if (itemId && getSelectedItemIdFromUrl() !== itemId) {
        debugger;
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

  const itemId = getItemId();
  if (itemId) {
    collection.setFocusForId(itemId);
  }

  const actionKey = getActionKey();
  if (actionKey) {
    collection.selectedActionKey = actionKey;
  }

  console.log(collection.currentIndex);

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
