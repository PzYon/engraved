import { useHotkeys } from "react-hotkeys-hook";
import { WrapperCollection } from "./WrapperCollection";
import { useMemo, useState } from "react";
import { WrapperCollectionItem } from "./WrapperCollectionItem";

export function useCollection(
  create: (
    focusIndex: number,
    setFocusIndex: (value: number) => void,
  ) => WrapperCollection,
  deps: unknown[],
) {
  const [focusIndex, setFocusIndex] = useState(-1);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const collection = useMemo(() => create(focusIndex, setFocusIndex), deps);

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
