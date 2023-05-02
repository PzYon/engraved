import React, { useState } from "react";
import { styled, useTheme } from "@mui/material";
import { PageSection } from "../../../layout/pages/PageSection";
import { ISCrapListItem } from "./IScrapListItem";
import { ScrapListItem } from "./ScrapListItem";
import {
  AddOutlined,
  MoveDownOutlined,
  RemoveCircleOutline,
} from "@mui/icons-material";
import { Actions } from "../../../common/Actions";

export const ScrapList: React.FC<{
  isEditMode: boolean;
  value: string;
  hasTitleFocus: boolean;
  onChange: (json: string) => void;
}> = ({ isEditMode, value, hasTitleFocus, onChange }) => {
  const { palette } = useTheme();

  const [items, setItems] = useState<ISCrapListItem[]>(
    value ? JSON.parse(value) : []
  );

  return (
    <PageSection
      style={
        isEditMode && !hasTitleFocus
          ? { outline: "2px solid " + palette.primary.main }
          : {}
      }
    >
      <List>
        {items.map((item, index) => (
          <ScrapListItem
            key={index + "_" + item.label}
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
        ))}
      </List>
      {isEditMode ? (
        <ActionsContainer>
          <Actions
            actions={[
              {
                key: "add",
                label: "Add new",
                icon: <AddOutlined fontSize="small" />,
                onClick: addNew,
              },
              {
                key: "move-checked-to-bottom",
                label: "Move checked to bottom",
                icon: <MoveDownOutlined fontSize="small" />,
                onClick: () => {
                  updateItems(
                    items.sort((a, b) => {
                      return a.isCompleted == b.isCompleted
                        ? 0
                        : a.isCompleted
                        ? 1
                        : -1;
                    })
                  );
                },
              },
              {
                key: "delete-checked",
                label: "Delete checked",
                icon: <RemoveCircleOutline fontSize="small" />,
                onClick: () => {
                  updateItems(items.filter((i) => !i.isCompleted));
                },
              },
            ]}
          />
        </ActionsContainer>
      ) : null}
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

const ActionsContainer = styled("div")`
  display: flex;
  padding-left: 3px;
  padding-bottom: 3px;
`;
