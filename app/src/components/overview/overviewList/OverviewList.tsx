import React, { memo } from "react";
import { IEntity } from "../../../serverApi/IEntity";
import { OverviewListItem } from "./OverviewListItem";
import { styled, Typography } from "@mui/material";
import { getScheduleForUser } from "../scheduled/scheduleUtils";
import { useAppContext } from "../../../AppContext";
import { useOverviewListContext } from "./OverviewListContext";
import { OverviewListContextProvider } from "./OverviewListContextProvider";

interface IOverviewListProps {
  items: IEntity[];
  renderBeforeList?: (selectItem: (index: number) => void) => React.ReactNode;
  renderItem: (
    item: IEntity,
    index: number,
    hasFocus: boolean,
    giveFocus: () => void,
  ) => React.ReactNode;
  filterItem?: (item: IEntity) => boolean;
  onKeyDown?: (e: KeyboardEvent) => void;
}

export const OverviewList: React.FC<IOverviewListProps> = memo(
  (props: IOverviewListProps) => {
    return (
      <OverviewListContextProvider
        items={props.items}
        filterItem={props.filterItem}
        onKeyDown={props.onKeyDown}
      >
        <OverviewListInternal {...props} />
      </OverviewListContextProvider>
    );
  },
);

const OverviewListInternal: React.FC<IOverviewListProps> = ({
  renderBeforeList,
  renderItem,
}) => {
  const { user } = useAppContext();

  const {
    setActiveItemId,
    activeItemId,
    itemsToShow,
    hiddenItemsCount,
    removeItemParamsFromUrl,
    setShowAll,
  } = useOverviewListContext();

  return (
    <Host className="overview-list">
      {renderBeforeList?.((i) => setActiveItemId(itemsToShow[i].id))}

      {itemsToShow.map((item, index) => {
        const hasFocus = activeItemId === item.id;

        return (
          <OverviewListItem
            onClick={() => {
              if (hasFocus) {
                return;
              }

              setActiveItemId(item.id);
              removeItemParamsFromUrl();
            }}
            key={
              item.id + "-" + getScheduleForUser(item, user.id)?.nextOccurrence
            }
            item={item}
            hasFocus={hasFocus}
          >
            <RenderItem
              item={item}
              hasFocus={hasFocus}
              index={index}
              setActiveItemId={setActiveItemId}
              renderItem={renderItem}
            />
          </OverviewListItem>
        );
      })}
      {hiddenItemsCount ? (
        <Typography
          onClick={() => setShowAll(true)}
          sx={{
            cursor: "pointer",
            textAlign: "center",
            fontWeight: 200,
            pb: 3,
          }}
        >
          Show {hiddenItemsCount} hidden item(s)
        </Typography>
      ) : null}
    </Host>
  );
};

const RenderItem = React.memo(
  ({
    item,
    index,
    hasFocus,
    renderItem,
    setActiveItemId,
  }: {
    item: IEntity;
    index: number;
    hasFocus: boolean;
    renderItem?: (
      item: IEntity,
      index: number,
      hasFocus: boolean,
      giveFocus: () => void,
    ) => React.ReactNode;
    setActiveItemId: (id: string) => void;
  }) => {
    return renderItem(item, index, hasFocus, () => setActiveItemId(item.id));
  },
);

const Host = styled("ul")`
  list-style: none;
  padding: 0;

  // margin-top and -bottom needs to match with margin of
  // OverviewListItem in all modes (compact and non-compact)

  & > div:first-of-type .page-section {
    margin-top: ${(p) => p.theme.spacing(3)};
  }

  & > div:last-of-type .page-section {
    margin-bottom: ${(p) => p.theme.spacing(3)};
  }
`;
