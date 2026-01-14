import React, { useEffect, useMemo } from "react";
import { styled, Typography, useTheme } from "@mui/material";
import { ScrapListItem } from "./ScrapListItem";
import { ListItemCollection } from "./ListItemCollection";
import { IScrapListItem } from "./IScrapListItem";
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
import { ScrapBody } from "../ScrapBody";
import AddOutlined from "@mui/icons-material/AddOutlined";
import AutoFixHigh from "@mui/icons-material/AutoFixHigh";
import MoveDownOutlined from "@mui/icons-material/MoveDownOutlined";
import RemoveCircleOutline from "@mui/icons-material/RemoveCircleOutline";
import SyncAltOutlined from "@mui/icons-material/SyncAltOutlined";
import { IAction } from "../../../common/actions/IAction";
import { ScrapType } from "../../../../serverApi/IScrapEntry";
import { ActionIconButtonGroup } from "../../../common/actions/ActionIconButtonGroup";

export const ScrapList: React.FC = () => {
  const { palette } = useTheme();

  const {
    notes,
    setNotes,
    isEditMode,
    upsertScrap,
    scrapToRender,
    changeScrapType,
    hasTitleFocus,
  } = useScrapContext();

  const listItemCollection = useMemo(() => {
    const items: IScrapListItem[] = notes
      ? JSON.parse(notes)
      : [{ label: "", depth: 0, isCompleted: false } as IScrapListItem];

    return new ListItemCollection(items, (rawItems) =>
      setNotes(getItemsAsJson(rawItems)),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrapToRender.editedOn]);

  useEffect(() => {
    if (isEditMode) {
      listItemCollection.giveFocus(listItemCollection.items.length - 1, "end");
    }
  }, [isEditMode, listItemCollection]);

  const sensors = useSensors(useSensor(TouchSensor), useSensor(PointerSensor));

  return (
    <ScrapBody
      actions={[]}
      properties={[
        {
          key: "completed",
          label: "Completed",
          node: () => (
            <span>
              {listItemCollection.items.filter((i) => i.isCompleted).length}/
              {listItemCollection.items.length}
            </span>
          ),
        },
      ]}
    >
      {isEditMode ? (
        <ActionIconButtonGroup
          alignToPosition="top"
          stickToPosition="top"
          actions={getEditModeActions()}
        />
      ) : null}

      <BodyHost
        key={isEditMode.toString()}
        style={
          isEditMode && !hasTitleFocus
            ? { outline: "2px solid " + palette.primary.main }
            : isEditMode && hasTitleFocus
              ? { outline: "2px solid " + palette.background.default }
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
      </BodyHost>
    </ScrapBody>
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

  function getEditModeActions(): IAction[] {
    return [
      {
        onClick: () => {
          changeScrapType(
            listItemCollection.items.map((i) => i.label),
            ScrapType.Markdown,
          );
        },
        key: "toggle-type",
        icon: <AutoFixHigh fontSize="small" />,
        label: "Change type to markdown",
      },
      {
        key: "add",
        label: "Add new",
        icon: <AddOutlined fontSize="small" />,
        onClick: () =>
          listItemCollection.addItem(listItemCollection.items.length - 1),
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
    ];
  }
};

function getItemsAsJson(rawItems: IScrapListItem[]) {
  return JSON.stringify(rawItems);
}

const BodyHost = styled("div")`
  border-radius: 5px;
  width: calc(100% - 4px);
  margin-left: 2px; // outline = 2px
  margin-top: 2px; // outline = 2px
`;

const List = styled("ul")`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;
