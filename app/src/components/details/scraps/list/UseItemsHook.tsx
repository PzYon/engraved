import { useMemo, useState } from "react";
import { ISCrapListItem } from "./IScrapListItem";
import { ListItemWrapperCollection } from "./ListItemWrapperCollection";
import { ListItemWrapper } from "./ListItemWrapper";

export const useItemsHook = (
  json: string,
  onChange: (json: string) => void,
  editedOn: string,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setItems] = useState<ISCrapListItem[]>(parseItems());

  return useMemo(() => {
    return new ListItemWrapperCollection(
      parseItems().map((i) => new ListItemWrapper(i)),
      onChangeWrapper,
    );
  }, [editedOn]);

  function parseItems(): ISCrapListItem[] {
    return json ? JSON.parse(json) : [];
  }

  function onChangeWrapper(changedItems: ISCrapListItem[]) {
    setItems(changedItems);
    onChange(JSON.stringify(changedItems));
  }
};
