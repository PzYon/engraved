import React from "react";
import { IEntity } from "../../../serverApi/IEntity";
import { useCollection } from "./wrappers/useCollection";
import { OverviewListItem } from "./OverviewListItem";

export const OverviewList: React.FC<{
  items: IEntity[];
  renderItem: (
    item: IEntity,
    index: number,
    hasFocus: boolean,
  ) => React.ReactNode;
}> = ({ items, renderItem }) => {
  const { collection, addItem } = useCollection([items]);

  return (
    <>
      {items.map((item, index) => (
        <OverviewListItem
          index={index}
          key={item.id}
          onClick={() => collection.setFocus(index)}
          addWrapperItem={addItem}
          item={item}
        >
          {renderItem(item, index, index === collection.currentIndex)}
        </OverviewListItem>
      ))}
    </>
  );
};
