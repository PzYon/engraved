import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IEntity } from "../../../serverApi/IEntity";
import { OverviewListItem } from "./OverviewListItem";
import { styled, Typography } from "@mui/material";
import { getScheduleForUser } from "../scheduled/scheduleUtils";
import { useAppContext } from "../../../AppContext";
import { useEngravedHotkeys } from "../../common/actions/useEngravedHotkeys";
import { useSearchParams } from "react-router-dom";
import { knownQueryParams } from "../../common/actions/searchParamHooks";

export interface IListItemsContext {
  activeItemId: string;
  setActiveItemId: (id: string) => void;
  moveDown: () => void;
  moveUp: () => void;
}

const ListItemsContext = createContext<IListItemsContext>({
  activeItemId: undefined,
  setActiveItemId: undefined,
  moveUp: undefined,
  moveDown: undefined,
});

export const useListItemsContext = () => {
  return useContext(ListItemsContext);
};

export const ListItemsProvider: React.FC<{
  items: IEntity[];
  children: React.ReactNode;
}> = ({ items, children }) => {
  const [activeItemId, setActiveItemId] = React.useState<string>(undefined);

  useEngravedHotkeys("ArrowUp", () => moveUp());
  useEngravedHotkeys("ArrowDown", () => moveDown());

  const contextValue = useMemo(
    () => ({
      activeItemId,
      setActiveItemId,
      moveDown,
      moveUp,
    }),
    [activeItemId, setActiveItemId, moveDown, moveUp],
  );

  return (
    <ListItemsContext.Provider value={contextValue}>
      {children}
    </ListItemsContext.Provider>
  );

  function getItem(direction: "up" | "down"): IEntity {
    const activeIndex = items.findIndex((item) => item.id === activeItemId);
    if (direction === "up") {
      return items[activeIndex > 0 ? activeIndex - 1 : items.length - 1];
    } else {
      return items[activeIndex < items.length - 1 ? activeIndex + 1 : 0];
    }
  }

  function moveDown() {
    console.log("moveDown called");
    return setActiveItemId(getItem("down")?.id);
  }

  function moveUp() {
    console.log("moveUp called");
    return setActiveItemId(getItem("up")?.id);
  }
};

export const OverviewList: React.FC<{
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
}> = ({ items, renderBeforeList, renderItem, filterItem, onKeyDown }) => {
  const { user } = useAppContext();
  const { setActiveItemId, activeItemId } = useListItemsContext();

  const [showAll, setShowAll] = useState(false);

  const filteredItems = items.filter(
    (f) => (showAll || filterItem?.(f)) ?? true,
  );

  const hiddenItems = items.length - filteredItems.length;

  const [searchParams] = useSearchParams();

  const activeItemIdFromUrl = searchParams.get(knownQueryParams.selectedItemId);

  // useEffect(() => {
  if (activeItemIdFromUrl && activeItemId !== activeItemIdFromUrl) {
    //setActiveItemId(activeItemIdFromUrl);
  }
  // }, [activeItemIdFromUrl, activeItemId]);

  useEffect(() => {
    console.log("activeItemId changed", activeItemId);
  }, [activeItemId]);

  useEngravedHotkeys("*", (e) => {
    if (
      !onKeyDown ||
      e.code === "ArrowUp" ||
      e.code === "ArrowDown" ||
      e.code === "Enter"
    ) {
      return;
    }

    setActiveItemId(undefined);
    onKeyDown?.(e);
    e.preventDefault();
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
            tabIndex={index}
            key={
              item.id + "-" + getScheduleForUser(item, user.id)?.nextOccurrence
            }
            item={item}
            hasFocus={hasFocus}
          >
            {renderItem(item, index, hasFocus, () => {
              if (item.id !== activeItemId) {
                setActiveItemId(item.id);
              }
            })}
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

// const Foo: React.FC<{
//   item: IEntity;
//   index: number;
//   hasFocus: boolean;
//   renderItem: (
//     item: IEntity,
//     index: number,
//     hasFocus: boolean,
//     giveFocus: () => void,
//   ) => React.ReactNode;
//   setActiveItemId: (id: string) => void;
// }> = ({}) => {
//   return <div>foo</div>;
// };

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
