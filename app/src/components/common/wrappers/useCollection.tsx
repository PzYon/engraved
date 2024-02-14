import { useHotkeys } from "react-hotkeys-hook";
import { BaseWrapperCollection } from "./BaseWrapperCollection";
import { useMemo, useState } from "react";
import { BaseItemWrapper } from "./BaseItemWrapper";

export function useCollection<
  TCollection extends BaseWrapperCollection<TItem>,
  TItem extends BaseItemWrapper<{ id?: string }>,
>(
  create: (
    focusIndex: number,
    setFocusIndex: (value: number) => void,
  ) => TCollection,
  deps: unknown[],
) {
  const [focusIndex, setFocusIndex] = useState(-1);

  const collection = useMemo(() => create(focusIndex, setFocusIndex), []);

  const keyToken = useMemo(
    () => Math.random(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  );

  useHotkeys("alt+up", () => {
    collection.moveFocusUp();
  });

  useHotkeys("alt+down", () => {
    collection.moveFocusDown();
  });

  console.log("collection ", collection.getItemCount());

  return {
    collection,
    keyToken,
    focusIndex,
    addItem: (wrapper: TItem) => collection.add(wrapper),
  };
}
