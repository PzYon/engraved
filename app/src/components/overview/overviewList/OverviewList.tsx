import React, { useEffect, useState } from "react";
import { IEntity } from "../../../serverApi/IEntity";
import { OverviewListItem } from "./OverviewListItem";
import { styled, Typography } from "@mui/material";
import { getScheduleForUser } from "../scheduled/scheduleUtils";
import { useAppContext } from "../../../AppContext";
import { useEngravedHotkeys } from "../../common/actions/useEngravedHotkeys";
import { useSearchParams } from "react-router-dom";
import { knownQueryParams } from "../../common/actions/searchParamHooks";

export const OverviewList: React.FC<{
  items: IEntity[];
  renderBeforeList?: (selectItem: (index: number) => void) => React.ReactNode;
  renderItem: (
    item: IEntity,
    index: number,
    hasFocus: boolean,
  ) => React.ReactNode;
  filterItem?: (item: IEntity) => boolean;
}> = ({ items, renderBeforeList, renderItem, filterItem }) => {
  const { user } = useAppContext();

  const [showAll, setShowAll] = useState(false);

  const filteredItems = items.filter(
    (f) => (showAll || filterItem?.(f)) ?? true,
  );

  const hiddenItems = items.length - filteredItems.length;

  const [activeItemId, setActiveItemId] = React.useState<string>(undefined);

  const [searchParams] = useSearchParams();

  const activeItemIdFromUrl = searchParams.get(knownQueryParams.selectedItemId);

  useEffect(() => {
    if (activeItemIdFromUrl && activeItemId !== activeItemIdFromUrl) {
      setActiveItemId(activeItemIdFromUrl);
    }
  }, [activeItemIdFromUrl, activeItemId]);

  useEngravedHotkeys("up", () => {
    setActiveItemId(getItem(items, activeItemId, "up").id);
  });

  useEngravedHotkeys("down", () => {
    setActiveItemId(getItem(items, activeItemId, "down").id);
  });

  return (
    <Host>
      {renderBeforeList?.((i) => setActiveItemId(items[i].id))}

      {filteredItems.map((item, index) => {
        const hasFocus = activeItemId === item.id;

        if (hasFocus) {
          console.log("rendering active item", activeItemId);
        }

        return (
          <OverviewListItem
            key={
              item.id + "-" + getScheduleForUser(item, user.id)?.nextOccurrence
            }
            item={item}
            hasFocus={hasFocus}
          >
            {renderItem(item, index, hasFocus)}
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

function getItem(
  items: IEntity[],
  activeItemId: string,
  direction: "up" | "down",
): IEntity {
  const activeIndex = items.findIndex((item) => item.id === activeItemId);
  if (direction === "up") {
    return items[activeIndex > 0 ? activeIndex - 1 : items.length - 1];
  } else {
    return items[activeIndex < items.length - 1 ? activeIndex + 1 : 0];
  }
}

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
