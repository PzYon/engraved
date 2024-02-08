import React, { useEffect, useMemo } from "react";
import { styled, Typography, useTheme } from "@mui/material";
import { ScrapListItem } from "./ScrapListItem";
import {
  AddOutlined,
  MoveDownOutlined,
  RemoveCircleOutline,
  SyncAltOutlined,
} from "@mui/icons-material";
import { ActionIconButtonGroup } from "../../../common/actions/ActionIconButtonGroup";
import { ListItemCollection } from "./ListItemCollection";
import { ISCrapListItem } from "./IScrapListItem";
import {
  closestCenter,
  DndContext,
  DragOverEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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
    return new ListItemCollection(items, (rawItems) =>
      onChange(getItemsAsJson(rawItems)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedOn]);

  useEffect(() => {
    if (isEditMode) {
      listItemsCollection.giveFocus(0);
    }
  }, [isEditMode, listItemsCollection]);

  const sensors = useSensors(useSensor(TouchSensor), useSensor(PointerSensor));

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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={listItemsCollection.items.map((item, index) => ({
                ...item,
                id: listItemsCollection.getReactKey(index),
              }))}
              strategy={verticalListSortingStrategy}
            >
              {listItemsCollection.items.map((item, index) => (
                <ScrapListItem
                  key={listItemsCollection.getReactKey(index)}
                  listItemsCollection={listItemsCollection}
                  index={index}
                  listItem={item}
                  isEditMode={isEditMode}
                  onChange={(updatedItem) => {
                    listItemsCollection.updateItem(index, updatedItem);

                    if (!isEditMode) {
                      onSave(getItemsAsJson(listItemsCollection.items));
                    }
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </List>
      {isEditMode ? (
        <ActionsContainer>
          <ActionIconButtonGroup
            actions={[
              {
                key: "add",
                label: "Add new",
                icon: <AddOutlined fontSize="small" />,
                onClick: () =>
                  listItemsCollection.addItem(
                    listItemsCollection.items.length - 1,
                  ),
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
                onClick: () => listItemsCollection.toggleAllChecked(),
              },
              {
                key: "delete-checked",
                label: "Delete checked",
                icon: <RemoveCircleOutline fontSize="small" />,
                onClick: () => listItemsCollection.deleteAllChecked(),
              },
            ]}
          />
        </ActionsContainer>
      ) : null}
    </Host>
  );

  function handleDragEnd(event: DragOverEvent) {
    const { active, over, delta } = event;

    const currentIndex = listItemsCollection.getItemIndex(active.id as string);

    let newIndex = currentIndex;

    if (active.id !== over.id) {
      newIndex = listItemsCollection.getItemIndex(over.id as string);

      listItemsCollection.moveItemVertically(currentIndex, newIndex);
    }

    if (delta.x > 20) {
      listItemsCollection.moveItemRight(newIndex);
      return;
    }

    if (delta.x < 20) {
      listItemsCollection.moveItemLeft(newIndex);
      return;
    }
  }
};

function getItemsAsJson(rawItems: ISCrapListItem[]) {
  return JSON.stringify(rawItems);
}

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
