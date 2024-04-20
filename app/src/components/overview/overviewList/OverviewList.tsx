import React, { useState } from "react";
import { IEntity } from "../../../serverApi/IEntity";
import { useCollection } from "./wrappers/useCollection";
import { OverviewListItem } from "./OverviewListItem";
import { Typography } from "@mui/material";

export const OverviewList: React.FC<{
  items: IEntity[];
  renderItem: (
    item: IEntity,
    index: number,
    hasFocus: boolean,
  ) => React.ReactNode;
  filterItem?: (item: IEntity) => boolean;
}> = ({ items, renderItem, filterItem }) => {
  const { collection, addItem } = useCollection([items]);
  const [showAll, setShowAll] = useState(false);

  const filteredItems = items.filter(
    (f) => (showAll || filterItem?.(f)) ?? true,
  );

  const hiddenItems = items.length - filteredItems.length;

  return (
    <>
      {filteredItems.map((item, index) => (
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
    </>
  );
};
