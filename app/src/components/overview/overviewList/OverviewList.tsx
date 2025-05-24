import React, { useState } from "react";
import { IEntity } from "../../../serverApi/IEntity";
import { OverviewListItem } from "./OverviewListItem";
import { styled, Typography } from "@mui/material";

export const OverviewList: React.FC<{
  items: IEntity[];
  renderBeforeList?: () => React.ReactNode;
  renderItem: (
    item: IEntity,
    index: number,
    hasFocus: boolean,
    giveFocus: () => void,
  ) => React.ReactNode;
  filterItem?: (item: IEntity) => boolean;
}> = ({ items, renderItem, filterItem }) => {
  // const { user } = useAppContext();

  const [showAll, setShowAll] = useState(false);

  const filteredItems = items.filter(
    (f) => (showAll || filterItem?.(f)) ?? true,
  );

  const hiddenItems = items.length - filteredItems.length;

  const [activeItemId, setActiveItemId] = useState<string>(undefined);

  return (
    <Host>
      {filteredItems.map((item, index) => {
        const hasFocus = activeItemId === item.id;
        return (
          <OverviewListItem
            tabIndex={1000 + index}
            key={
              item.id + "-" //+ getScheduleForUser(item, user.id)?.nextOccurrence
            }
            item={item}
            hasFocus={hasFocus}
            onFocus={() => {
              console.log("on focus", item.id);
              setActiveItemId(item.id);
            }}
          >
            {renderItem(item, index, hasFocus, () => alert("focus"))}
          </OverviewListItem>
        );
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
