import { useMemo } from "react";
import { ISCrapListItem } from "./IScrapListItem";
import { ListItemWrapperCollection } from "./ListItemWrapperCollection";
import { ListItemWrapper } from "./ListItemWrapper";

export const useItemsHook = (
  json: string,
  onChange: (json: string) => void,
  editedOn: string,
) => {
  return useMemo(() => {
    return new ListItemWrapperCollection(
      parseItems().map((i) => new ListItemWrapper(i)),
      onChange,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedOn]);

  function parseItems(): ISCrapListItem[] {
    return json ? JSON.parse(json) : [];
  }
};
