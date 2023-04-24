import React, { useState } from "react";
import { styled } from "@mui/material";
import { PageSection } from "../../../layout/pages/PageSection";
import { ISCrapListItem } from "./IScrapListItem";
import { ScrapListItem } from "./ScrapListItem";
import { IconButtonWrapper } from "../../../common/IconButtonWrapper";
import { AddOutlined } from "@mui/icons-material";

export const ScrapList: React.FC<{
  isEditMode: boolean;
  value: string;
  onChange: (json: string) => void;
}> = ({ isEditMode, value, onChange }) => {
  const [items, setItems] = useState<ISCrapListItem[]>(
    value ? JSON.parse(value) : []
  );

  return (
    <PageSection>
      <List>
        {items.map((item, index) => (
          <ListItem key={index + "_" + item.label}>
            <ScrapListItem
              isEditMode={isEditMode}
              listItem={item}
              onChange={(updatedItem) => {
                const updatedItems = [...items];

                if (!updatedItem) {
                  updatedItems.splice(index, 1);
                } else {
                  updatedItems[index] = updatedItem;
                }

                updateItems(updatedItems);
              }}
              onEnter={() => {
                const updatedItems = [...items];

                updatedItems.splice(index + 1, 0, {
                  label: "",
                  isCompleted: false,
                });

                updateItems(updatedItems);
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
  );

  function updateItems(updatedItems: ISCrapListItem[]) {
    setItems(updatedItems);

    onChange(JSON.stringify(updatedItems));
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
