import React, { useState } from "react";
import { Button, styled } from "@mui/material";
import { PageSection } from "../../../layout/pages/PageSection";
import { ScrapListContextProvider } from "./ScrapListContext";
import { ISCrapListItem } from "./IScrapListItem";
import { ScrapListItem } from "./ScrapListItem";
import { IconButtonWrapper } from "../../../common/IconButtonWrapper";
import { AddOutlined } from "@mui/icons-material";

export const ScrapList: React.FC = () => {
  const [listItems, setListItems] = useState<ISCrapListItem[]>([]);

  return (
    <ScrapListContextProvider>
      <PageSection>
        <List>
          {listItems.map((item, index) => (
            <ListItem key={index}>
              <ScrapListItem
                index={index}
                listItem={item}
                onChange={(updatedItem) => {
                  const updatedItems = [...listItems];
                  updatedItems[index] = updatedItem;
                  setListItems(updatedItems);
                }}
                onKeyUp={(direction) => {
                  switch (direction) {
                    case "enter":
                      addNew();
                      break;
                  }
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
      </PageSection>
    </ScrapListContextProvider>
  );

  function addNew() {
    setListItems([...listItems, { label: "", isCompleted: false }]);
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
