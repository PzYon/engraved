import React, { useEffect } from "react";
import { styled } from "@mui/material";
import { useEngravedHotkeys } from "../actions/useEngravedHotkeys";
import { useSearchParams } from "react-router-dom";

interface IItem {
  id: string;
  label: string;
}

const items: IItem[] = [
  {
    id: "a",
    label: "Foo",
  },
  {
    id: "b",
    label: "Bar",
  },
  {
    id: "c",
    label: "Baz",
  },
];

function getItem(
  items: IItem[],
  activeItemId: string,
  direction: "up" | "down",
): IItem {
  const activeIndex = items.findIndex((item) => item.id === activeItemId);
  if (direction === "up") {
    return items[activeIndex > 0 ? activeIndex - 1 : items.length - 1];
  } else {
    return items[activeIndex < items.length - 1 ? activeIndex + 1 : 0];
  }
}

export const NewList: React.FC = () => {
  const [activeItemId, setActiveItemId] = React.useState<string>(undefined);

  const [searchParams] = useSearchParams();

  const activeItemIdFromUrl = searchParams.get("id");
  const activeItemActionFromUrl = searchParams.get("action");

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
    <div>
      <h2>New List</h2>
      {items.map((item) => {
        return (
          <NewListItem
            onClick={() => setActiveItemId(item.id)}
            key={item.id}
            item={item}
            isActive={activeItemId === item.id}
            activeItemAction={activeItemActionFromUrl}
          />
        );
      })}
    </div>
  );
};

export const NewListItem: React.FC<{
  item: IItem;
  isActive: boolean;
  onClick: () => void;
  activeItemAction?: string;
}> = ({ item, isActive, onClick, activeItemAction }) => {
  return (
    <ItemContainer key={item.id} isActive={isActive} onClick={onClick}>
      {item.label}
      {isActive ? <div>Active route: {activeItemAction ?? "none"}</div> : null}
    </ItemContainer>
  );
};

const ItemContainer = styled("div")<{ isActive?: boolean }>`
  outline: ${(p) => (p.isActive ? "1px solid deeppink" : "none")};
`;
