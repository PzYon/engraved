import React, { useState } from "react";
import { IEntity } from "../../../serverApi/IEntity";
import { useOverviewCollection } from "./wrappers/useOverviewCollection";
import { OverviewListItem } from "./OverviewListItem";
import { styled, Typography } from "@mui/material";
import { getScheduleForUser } from "../scheduled/scheduleUtils";
import { useAppContext } from "../../../AppContext";
import { OverviewItemCollection } from "./wrappers/OverviewItemCollection";

export const OverviewList: React.FC<{
  items: IEntity[];
  renderBeforeList?: (collection: OverviewItemCollection) => React.ReactNode;
  renderItem: (
    item: IEntity,
    index: number,
    hasFocus: boolean,
    giveFocus: () => void,
  ) => React.ReactNode;
  filterItem?: (item: IEntity) => boolean;
  doNotUseUrl?: boolean;
}> = ({ items, renderBeforeList, renderItem, filterItem, doNotUseUrl }) => {
  const { user } = useAppContext();

  const { collection, addItem } = useOverviewCollection(doNotUseUrl);
  const [showAll, setShowAll] = useState(false);

  const filteredItems = items.filter(
    (f) => (showAll || filterItem?.(f)) ?? true,
  );

  const hiddenItems = items.length - filteredItems.length;

  return (
    <Host>
      {renderBeforeList?.(collection)}
      {filteredItems.map((item, index) => {
        const hasFocus = index === collection.currentIndex;

        return (
          <OverviewListItem
            index={index}
            key={
              item.id + "-" + getScheduleForUser(item, user.id)?.nextOccurrence
            }
            onClick={setFocus}
            addWrapperItem={addItem}
            item={item}
            hasFocus={hasFocus}
          >
            {renderItem(item, index, hasFocus, setFocus)}
          </OverviewListItem>
        );

        function setFocus() {
          collection.setFocus(index);
        }
      })}
      {hiddenItems ? (
        <Typography
          onClick={() => setShowAll(true)}
          sx={{
            cursor: "pointer",
            textAlign: "center",
            fontWeight: 200,
            pb: 3,
          }}
        >
          Show {hiddenItems} hidden item(s)
        </Typography>
      ) : null}
    </Host>
  );
};

const Host = styled("div")`
  // margin-top and -bottom needs to match with margin of
  // OverviewListItem in all modes (compact and non-compact)

  & > div:first-of-type .page-section {
    margin-top: ${(p) => p.theme.spacing(3)};
  }

  & > div:last-of-type .page-section {
    margin-bottom: ${(p) => p.theme.spacing(3)};
  }
`;
