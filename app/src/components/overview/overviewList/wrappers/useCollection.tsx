import { useHotkeys } from "react-hotkeys-hook";
import { WrapperCollection } from "./WrapperCollection";
import { useMemo, useState } from "react";
import { WrapperCollectionItem } from "./WrapperCollectionItem";

export function useCollection(deps: unknown[]) {
  const [focusIndex, setFocusIndex] = useState(-1);

  const collection = useMemo(
    () => new WrapperCollection(focusIndex, setFocusIndex),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...deps],
  );

  useHotkeys("alt+up", () => {
    collection.moveFocusUp();
  });

  useHotkeys("alt+down", () => {
    collection.moveFocusDown();
  });

  return {
    collection,
    focusIndex,
    addItem: (wrapper: WrapperCollectionItem) => collection.add(wrapper),
  };
}
