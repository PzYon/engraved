import React, { useState } from "react";
import { styled } from "@mui/material";
import { PageSection } from "../../../layout/pages/PageSection";
import { ISCrapListItem } from "./IScrapListItem";
import { ScrapListItem } from "./ScrapListItem";
import { IconButtonWrapper } from "../../../common/IconButtonWrapper";
import { AddOutlined } from "@mui/icons-material";
import { editModeKind } from "../Scrap";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let blurTimer: any;

export const ScrapList: React.FC<{
  editMode: editModeKind;
  setEditMode: (mode: editModeKind) => void;
  value: string;
  onFocus: () => void;
  onChange: (json: string) => void;
  onBlur: () => void;
}> = ({ editMode, setEditMode, value, onFocus, onChange, onBlur }) => {
  const [items, setItems] = useState<ISCrapListItem[]>(
    value ? JSON.parse(value) : []
  );

  return (
    <PageSection>
      <ClickContainer onClick={() => setEditMode("fromBody")}>
        <List>
          {items.map((item, index) => (
            <ListItem key={index + "_" + item.label}>
              <ScrapListItem
                editMode={editMode}
                listItem={item}
                onFocus={() => {
                  setEditMode("fromBody");
                  clearTimeout(blurTimer);
                  onFocus();
                }}
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
      </ClickContainer>
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

const ClickContainer = styled("div")``;

const List = styled("ul")`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const ListItem = styled("li")`
  display: flex;
  align-items: center;
`;
