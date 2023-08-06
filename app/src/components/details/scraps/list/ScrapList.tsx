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

  const listItemsCollection = useMemo(() => {
    return new ListItemWrapperCollection(
      items.map((i) => new ListItemWrapper(i)),
      (changedItems) => {
        setItems(changedItems);
        onChange(JSON.stringify(changedItems));
      }
    );
  }, []);

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
              listItemWrapper={item}
              moveFocusUp={() => listItemsCollection.moveFocusUp(index)}
              moveFocusDown={() => listItemsCollection.moveFocusDown(index)}
              moveItemUp={() => listItemsCollection.moveItemUp(index)}
              moveItemDown={() => listItemsCollection.moveItemDown(index)}
              onChange={(updatedItem) =>
                listItemsCollection.update(index, updatedItem)
              }
              onDelete={() => listItemsCollection.remove(index)}
              onEnter={() => listItemsCollection.addNewLine(index)}
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
                onClick: () => listItemsCollection.moveCheckedToBottom(),
              },
              {
                key: "toggle-checked",
                label: "Toggle checked",
                icon: <SyncAltOutlined fontSize="small" />,
                onClick: () => listItemsCollection.toggleChecked(),
              },
              {
                key: "delete-checked",
                label: "Delete checked",
                icon: <RemoveCircleOutline fontSize="small" />,
                onClick: () => listItemsCollection.deleteChecked(),
              },
            ]}
          />
        </ActionsContainer>
      ) : null}
    </Host>
  );

  function addNew() {
    listItemsCollection.add(
      listItemsCollection.items.length,
      new ListItemWrapper({
        label: "",
        isCompleted: false,
      })
    );
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
