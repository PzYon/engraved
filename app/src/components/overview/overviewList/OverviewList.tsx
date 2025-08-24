import React, { memo, useEffect, useState } from "react";
import { IEntity } from "../../../serverApi/IEntity";
import { OverviewListItem } from "./OverviewListItem";
import { styled, Typography } from "@mui/material";
import { getScheduleForUser } from "../scheduled/scheduleUtils";
import { useAppContext } from "../../../AppContext";
import { useEngravedHotkeys } from "../../common/actions/useEngravedHotkeys";
import { useSearchParams } from "react-router-dom";
import { knownQueryParams } from "../../common/actions/searchParamHooks";
import { useOverviewListContext } from "./OverviewListContext";
import { OverviewListContextProvider } from "./OverviewListContextProvider";
import { IJournal } from "../../../serverApi/IJournal";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";

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
      <OverviewListContextProvider items={props.items}>
        <OverviewListInternal {...props} />
      </OverviewListContextProvider>
    );
  },
);

const OverviewListInternal: React.FC<IOverviewListProps> = ({
  items,
  renderBeforeList,
  renderItem,
  filterItem,
  onKeyDown,
}) => {
  const { user, setAppAlert } = useAppContext();

  const { setActiveItemId, activeItemId, moveUp, moveDown } =
    useOverviewListContext();

  const [showAll, setShowAll] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const activeItemIdFromUrl = searchParams.get(knownQueryParams.selectedItemId);

  const [inMemorySearchText, setInMemorySearchText] = useState("");

  console.log("in memory search text:", inMemorySearchText);

  useEffect(() => {
    if (activeItemIdFromUrl && activeItemId !== activeItemIdFromUrl) {
      setActiveItemId(activeItemIdFromUrl);
    }
  }, [activeItemId, activeItemIdFromUrl, setActiveItemId]);

  useEffect(() => {
    if (inMemorySearchText) {
      setAppAlert({
        title: inMemorySearchText,
        message: "",
        type: "success",
      });
    } else {
      setAppAlert(undefined);
    }
  }, [inMemorySearchText]);

  useEngravedHotkeys("*", (e) => {
    switch (e.code) {
      case "ArrowUp": {
        e.preventDefault();
        removeItemParamsFromUrl();
        moveUp();
        break;
      }

      case "ArrowDown": {
        e.preventDefault();
        removeItemParamsFromUrl();
        moveDown();
        break;
      }

      default: {
        if (onKeyDown) {
          onKeyDown?.(e);
        } else {
          if (e.key.match(/^\w$/)) {
            setInMemorySearchText((current) => current + e.key);
          } else if (e.key === "Backspace") {
            setInMemorySearchText((current) =>
              current.substring(0, current.length - 1),
            );
          }
        }
      }
    }
  });

  const filteredItems = items.filter(
    (f) =>
      (((showAll || filterItem?.(f)) ?? true) && !inMemorySearchText) ||
      (f as IJournal).name
        ?.toLowerCase()
        .indexOf(inMemorySearchText.toLowerCase()) > -1 ||
      (f as IScrapEntry).title
        ?.toLowerCase()
        .indexOf(inMemorySearchText.toLowerCase()) > -1,
  );

  const hiddenItems = items.length - filteredItems.length;

  return (
    <Host>
      {renderBeforeList?.((i) => setActiveItemId(items[i].id))}

      {filteredItems.map((item, index) => {
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

  function removeItemParamsFromUrl() {
    if (
      !searchParams.get(knownQueryParams.selectedItemId) &&
      !searchParams.get(knownQueryParams.actionKey)
    ) {
      return;
    }

    searchParams.delete(knownQueryParams.selectedItemId);
    searchParams.delete(knownQueryParams.actionKey);
    setSearchParams(searchParams);
  }
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
