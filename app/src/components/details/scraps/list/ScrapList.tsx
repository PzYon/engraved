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
import { useScrapContext } from "../ScrapContext";

export const ScrapList: React.FC = () => {
  const { palette } = useTheme();

  const {
    notes,
    setNotes,
    isEditMode,
    upsertScrap,
    scrapToRender,
    hasTitleFocus,
  } = useScrapContext();

  const listItemCollection = useMemo(() => {
    const items: ISCrapListItem[] = notes ? JSON.parse(notes) : [];
    return new ListItemCollection(items, (rawItems) =>
      setNotes(getItemsAsJson(rawItems)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrapToRender.editedOn]);

  useEffect(() => {
    if (isEditMode) {
      listItemCollection.giveFocus(0);
    }
  }, [isEditMode, listItemCollection]);

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
        {!isEditMode && !listItemCollection.items?.length ? (
          <Typography sx={{ opacity: 0.4 }}>No items yet.</Typography>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={listItemCollection.items.map((item, index) => ({
                ...item,
                id: listItemCollection.getReactKey(index),
              }))}
              strategy={verticalListSortingStrategy}
            >
              {listItemCollection.items.map((item, index) => (
                <ScrapListItem
                  key={listItemCollection.getReactKey(index)}
                  listItemsCollection={listItemCollection}
                  index={index}
                  listItem={item}
                  isEditMode={isEditMode}
                  onChange={(updatedItem) => {
                    listItemCollection.updateItem(index, updatedItem);

                    if (!isEditMode) {
                      upsertScrap(getItemsAsJson(listItemCollection.items));
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
                  listItemCollection.addItem(
                    listItemCollection.items.length - 1,
                  ),
              },
              {
                key: "move-checked-to-bottom",
                label: "Move checked to bottom",
                icon: <MoveDownOutlined fontSize="small" />,
                onClick: () => listItemCollection.moveCheckedToBottom(),
              },
              {
                key: "toggle-checked",
                label: "Toggle checked",
                icon: <SyncAltOutlined fontSize="small" />,
                onClick: () => listItemCollection.toggleAllChecked(),
              },
              {
                key: "delete-checked",
                label: "Delete checked",
                icon: <RemoveCircleOutline fontSize="small" />,
                onClick: () => listItemCollection.deleteAllChecked(),
              },
            ]}
          />
        </ActionsContainer>
      ) : null}
    </Host>
  );

  function handleDragEnd(event: DragOverEvent) {
    const { active, over, delta } = event;

    const currentIndex = listItemCollection.getItemIndex(active.id as string);

    const newIndex =
      active.id === over.id
        ? undefined
        : listItemCollection.getItemIndex(over.id as string);

    let newDepth = listItemCollection.items[currentIndex].depth;

    if (Math.abs(delta.x) > 20) {
      const depthDelta = Math.floor(Math.abs(delta.x) / 20);
      newDepth = delta.x < 0 ? newDepth - depthDelta : newDepth + depthDelta;
    }

    listItemCollection.moveItem(currentIndex, {
      index: newIndex,
      depth: newDepth,
    });
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
