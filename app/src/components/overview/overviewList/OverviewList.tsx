import React, { useState } from "react";
import { IEntity } from "../../../serverApi/IEntity";
import { useCollection } from "./wrappers/useCollection";
import { OverviewListItem } from "./OverviewListItem";
import { styled, Typography } from "@mui/material";
import { getScheduleForUser } from "../scheduled/scheduleUtils";
import { useAppContext } from "../../../AppContext";

export const OverviewList: React.FC<{
  items: IEntity[];
  renderItem: (
    item: IEntity,
    index: number,
    hasFocus: boolean,
    giveFocus: () => void,
  ) => React.ReactNode;
  filterItem?: (item: IEntity) => boolean;
}> = ({ items, renderItem, filterItem }) => {
  const { user } = useAppContext();

  const { collection, addItem } = useCollection([items]);
  const [showAll, setShowAll] = useState(false);

  const filteredItems = items.filter(
    (f) => (showAll || filterItem?.(f)) ?? true,
  );

  const hiddenItems = items.length - filteredItems.length;

  return (
    <Host>
      {filteredItems.map((item, index) => {
        return (
          <OverviewListItem
            index={index}
            key={
              item.id + "-" + getScheduleForUser(item, user.id)?.nextOccurrence
            }
            onClick={setFocus}
            addWrapperItem={addItem}
            item={item}
          >
            {renderItem(
              item,
              index,
              index === collection.currentIndex,
              setFocus,
            )}
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
