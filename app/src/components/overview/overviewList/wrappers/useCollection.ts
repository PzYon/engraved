import { useHotkeys } from "react-hotkeys-hook";
import { WrapperCollection } from "./WrapperCollection";
import { useEffect, useMemo, useState } from "react";
import { WrapperCollectionItem } from "./WrapperCollectionItem";

export function useCollection(deps: unknown[]) {
  const [focusIndex, setFocusIndex] = useState(-1);
  const [itemId, setItemId] = useState<string>(null);

  const collection = useMemo(
    () => new WrapperCollection(focusIndex, setFocusIndex, setItemId),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps],
  );

  useEffect(() => {
    collection.setFocusForId(itemId);
  }, [collection]);

  useHotkeys("alt+up", () => {
    collection.moveFocusUp();
  });

  useHotkeys("alt+down", () => {
    collection.moveFocusDown();
  });

  return {
    collection,
    addItem: (wrapper: WrapperCollectionItem) => collection.add(wrapper),
  };
}
