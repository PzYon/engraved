import React, { useState } from "react";
import { styled } from "@mui/material";
import { PageSection } from "../../../layout/pages/PageSection";
import { ScrapListContextProvider } from "./ScrapListContext";
import { ISCrapListItem } from "./IScrapListItem";
import { ScrapListItem } from "./ScrapListItem";
import { IconButtonWrapper } from "../../../common/IconButtonWrapper";
import { AddOutlined } from "@mui/icons-material";

let timers: any;

export const ScrapList: React.FC<{
  listItems: ISCrapListItem[];
  onBlur: (listItems: ISCrapListItem[]) => void;
}> = ({ listItems, onBlur }) => {
  const [items, setItems] = useState<ISCrapListItem[]>(listItems);

  function enqueueUpdate() {
    clearTimeout(timers);

    timers = setTimeout(() => {
      onBlur(items);
    });
  }

  return (
    <ScrapListContextProvider>
      <PageSection>
        <>
          <List>
            {items.map((item, index) => (
              <ListItem key={index}>
                <ScrapListItem
                  index={index}
                  listItem={item}
                  onChange={(updatedItem) => {
                    const updatedItems = [...items];
                    updatedItems[index] = updatedItem;
                    setItems(updatedItems);
                    enqueueUpdate();
                  }}
                  onKeyUp={(direction) => {
                    switch (direction) {
                      case "enter":
                        addNew();
                        break;
                    }
                  }}
                  onFocus={() => {
                    clearTimeout(timers);
                  }}
                />
              </ListItem>
            ))}
          </List>
          <IconButtonWrapper
            action={{
              key: "add",
              label: "Add new",
              icon: <AddOutlined fontSize="small" />,
              onClick: addNew,
            }}
          />
        </>
      </PageSection>
    </ScrapListContextProvider>
  );

  function addNew() {
    setItems([...items, { label: "", isCompleted: false }]);
  }
};

const List = styled("ul")`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const ListItem = styled("li")`
  display: flex;
  align-items: center;
`;
