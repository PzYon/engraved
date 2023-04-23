import React, { useState } from "react";
import { styled } from "@mui/material";
import { PageSection } from "../../../layout/pages/PageSection";
import { ScrapListContextProvider } from "./ScrapListContext";
import { ISCrapListItem } from "./IScrapListItem";
import { ScrapListItem } from "./ScrapListItem";
import { IconButtonWrapper } from "../../../common/IconButtonWrapper";
import { AddOutlined } from "@mui/icons-material";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let blurTimer: any;

export const ScrapList: React.FC<{
  value: string;
  onFocus: () => void;
  onChange: (json: string) => void;
  onBlur: () => void;
}> = ({ value, onFocus, onChange, onBlur }) => {
  const [items, setItems] = useState<ISCrapListItem[]>(
    value ? JSON.parse(value) : []
  );

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
                    onChangeInternal(index, updatedItem);
                  }}
                  onKeyUp={(direction) => {
                    switch (direction) {
                      case "enter":
                        addNew();
                        break;
                      case "delete":
                        onDeleteItem(index);
                        break;
                    }
                  }}
                  onFocus={() => {
                    clearTimeout(blurTimer);
                    onFocus();
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

  function onChangeInternal(index: number, updatedItem: ISCrapListItem) {
    const updatedItems = [...items];
    updatedItems[index] = updatedItem;
    setItems(updatedItems);

    onChange(JSON.stringify(updatedItems));

    enqueueOnBlur();
  }

  function onDeleteItem(index: number) {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);

    onChange(JSON.stringify(updatedItems));

    enqueueOnBlur();
  }

  function enqueueOnBlur() {
    clearTimeout(blurTimer);

    blurTimer = setTimeout(() => {
      onBlur();
    });
  }

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
