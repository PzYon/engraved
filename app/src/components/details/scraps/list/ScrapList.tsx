import React, { useState } from "react";
import { styled } from "@mui/material";
import { PageSection } from "../../../layout/pages/PageSection";
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
    <PageSection>
      <>
        <List>
          {items.map((item, index) => (
            <ListItem key={index + "_" + item.label}>
              <ScrapListItem
                listItem={item}
                onFocus={() => {
                  clearTimeout(blurTimer);
                  onFocus();
                }}
                onChange={(updatedItem) => {
                  const updatedItems = [...items];
                  updatedItems[index] = updatedItem;
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
                onDelete={() => {
                  const updatedItems = [...items];
                  updatedItems.splice(index, 1);
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
      </>
    </PageSection>
  );

  function updateItems(updatedItems: ISCrapListItem[]) {
    setItems(updatedItems);

    onChange(JSON.stringify(updatedItems));

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
