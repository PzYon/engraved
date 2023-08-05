import React, { useMemo, useState } from "react";
import { styled, Typography, useTheme } from "@mui/material";
import { ISCrapListItem } from "./IScrapListItem";
import { ScrapListItem } from "./ScrapListItem";
import {
  AddOutlined,
  MoveDownOutlined,
  RemoveCircleOutline,
  SyncAltOutlined,
} from "@mui/icons-material";
import { Actions } from "../../../common/Actions";
import { ListItemWrapperCollection } from "./ListItemWrapperCollection";
import { ListItemWrapper } from "./ListItemWrapper";

// todo:
// - cycle when moving up/down (start from beginning)
// - deleting a rw with "DEL" removes first char of new line

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

  const listItemsCollection = useMemo(
    () =>
      new ListItemWrapperCollection(
        items.map((i) => new ListItemWrapper(i)),
        setItems
      ),
    []
  );

  return (
    <Host
      style={
        isEditMode && !hasTitleFocus
          ? { outline: "2px solid " + palette.primary.main }
          : {}
      }
    >
      <List>
        {!isEditMode && !items?.length ? (
          <Typography sx={{ opacity: 0.4 }}>No items yet.</Typography>
        ) : (
          listItemsCollection.items.map((item, index) => (
            <ScrapListItem
              key={item.reactKey}
              isEditMode={isEditMode}
              listItem={item.raw}
              listItemWrapper={item}
              moveFocusDown={() => {
                listItemsCollection.giveFocus(index + 1);
              }}
              moveFocusUp={() => {
                listItemsCollection.giveFocus(index - 1);
              }}
              onChange={(updatedItem) => {
                listItemsCollection.update(index, updatedItem);
              }}
              onDelete={() => {
                listItemsCollection.remove(index);
              }}
              onEnter={() => {
                if (!items[index].label) {
                  return;
                }

                listItemsCollection.add(
                  index + 1,
                  new ListItemWrapper({
                    label: "",
                    isCompleted: false,
                  })
                );
              }}
            />
          ))
        )}
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
                key: "toggle-checked",
                label: "Toggle checked",
                icon: <SyncAltOutlined fontSize="small" />,
                onClick: () => {
                  const isMajorityCompleted =
                    items.filter((i) => i.isCompleted).length >
                    items.length / 2;

                  const areAllSameState =
                    items.filter((i) => i.isCompleted === isMajorityCompleted)
                      .length === items.length;

                  updateItems(
                    items.map((i) => {
                      i.isCompleted = areAllSameState
                        ? !isMajorityCompleted
                        : isMajorityCompleted;
                      return i;
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
    </Host>
  );

  function updateItems(updatedItems: ISCrapListItem[]) {
    setItems(updatedItems);

    onChange(JSON.stringify(updatedItems));
  }

  function addNew() {
    setItems([...items, { label: "", isCompleted: false }]);
  }
};

const Host = styled("div")`
  border-radius: 4px;
`;

const List = styled("ul")`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const ActionsContainer = styled("div")`
  display: flex;
  padding: 3px 0 4px 3px;
`;
