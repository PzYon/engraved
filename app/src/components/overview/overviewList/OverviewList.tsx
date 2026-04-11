import React, { memo } from "react";
import { IEntity } from "../../../serverApi/IEntity";
import { OverviewListItem } from "./OverviewListItem";
import { styled, Typography } from "@mui/material";
import { getScheduleForUser } from "../scheduled/scheduleUtils";
import { useAppContext } from "../../../AppContext";
import { useOverviewListContext } from "./OverviewListContext";
import { OverviewListContextProvider } from "./OverviewListContextProvider";
import { IEntry } from "../../../serverApi/IEntry";
import HistoryToggleOff from "@mui/icons-material/HistoryToggleOff";
import { differenceInDays } from "date-fns";

interface IOverviewListProps {
  items: IEntity[];
  renderBeforeList?: (selectItem: (index: number) => void) => React.ReactNode;
  showDaysBetween?: boolean;
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
  showDaysBetween,
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
          <>
            {showDaysBetween && index > 0 ? (
              <DifferenceInDays
                lastItem={itemsToShow[index - 1] as IEntry}
                item={item as IEntry}
              />
            ) : null}

            <OverviewListItem
              showDaysBetween={showDaysBetween}
              onClick={() => {
                if (hasFocus) {
                  return;
                }

                setActiveItemId(item.id);
                removeItemParamsFromUrl();
              }}
              key={
                item.id +
                "-" +
                getScheduleForUser(item, user.id)?.nextOccurrence
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
          </>
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

const DifferenceInDays: React.FC<{
  item: IEntry;
  lastItem: IEntry;
}> = ({ item, lastItem }) => {
  if (!item?.dateTime || !lastItem.dateTime) {
    return null;
  }

  const diff = differenceInDays(lastItem.dateTime, item.dateTime);

  return (
    <Typography
      sx={{
        pt: 1,
        pb: 1,
        pl: 1,
        ml: 3,
        borderLeft: "3px solid white",
      }}
    >
      <span
        style={{
          opacity: 0.4,
          fontSize: "small",
          display: "flex",
          alignItems: "center",
          color: "primary.main",
        }}
      >
        <HistoryToggleOff fontSize="small" sx={{ mr: 1 }} />
        {diff === 1 ? "1 day" : `${diff} days`}
      </span>
    </Typography>
  );
};
