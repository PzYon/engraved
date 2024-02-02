import React, { useEffect, useMemo } from "react";
import { styled, Typography, useTheme } from "@mui/material";
import { ScrapListItem } from "./ScrapListItem";
import {
  AddOutlined,
  MoveDownOutlined,
  RemoveCircleOutline,
  SyncAltOutlined,
} from "@mui/icons-material";
import { ActionGroup } from "../../../common/actions/ActionGroup";
import { ListItemWrapperCollection } from "./ListItemWrapperCollection";
import { ISCrapListItem } from "./IScrapListItem";

export const ScrapList: React.FC<{
  isEditMode: boolean;
  value: string;
  hasTitleFocus: boolean;
  onChange: (json: string) => void;
  editedOn: string;
  onSave?: (notesToSave?: string) => void;
}> = ({ isEditMode, value, hasTitleFocus, onChange, editedOn, onSave }) => {
  const { palette } = useTheme();

  const listItemsCollection = useMemo(() => {
    const items: ISCrapListItem[] = value ? JSON.parse(value) : [];
    return new ListItemWrapperCollection(items, (rawItems) =>
      onChange(JSON.stringify(rawItems)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedOn]);

  useEffect(() => {
    if (isEditMode) {
      listItemsCollection.giveFocus(0);
    }
  }, [isEditMode, listItemsCollection]);

  return (
    <Host
      key={isEditMode.toString()}
      style={
        isEditMode && !hasTitleFocus
          ? { outline: "2px solid " + palette.primary.main }
          : {}
      }
    >
      <List>
        {!isEditMode && !listItemsCollection.items?.length ? (
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
              moveItemLeft={() => listItemsCollection.moveItemLeft(index)}
              moveItemRight={() => listItemsCollection.moveItemRight(index)}
              onChange={(updatedItem) => {
                listItemsCollection.updateItem(index, updatedItem);

                if (!isEditMode) {
                  onSave(JSON.stringify(listItemsCollection.items));
                }
              }}
              onDelete={() => listItemsCollection.removeItem(index)}
              onEnter={() => listItemsCollection.addItem(index + 1)}
            />
          ))
        )}
      </List>
      {isEditMode ? (
        <ActionsContainer>
          <ActionGroup
            actions={[
              {
                key: "add",
                label: "Add new",
                icon: <AddOutlined fontSize="small" />,
                onClick: () =>
                  listItemsCollection.addItem(listItemsCollection.items.length),
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
