import React, { useEffect, useRef, useState } from "react";
import { IScrapListItem } from "./IScrapListItem";
import { Checkbox, styled } from "@mui/material";
import { DragIndicator, RemoveCircleOutline } from "@mui/icons-material";
import { AutogrowTextField } from "../../../common/AutogrowTextField";
import { SxProps } from "@mui/system";
import { Markdown } from "../markdown/Markdown";
import { ActionIconButtonGroup } from "../../../common/actions/ActionIconButtonGroup";
import { ListItemCollection } from "./ListItemCollection";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const ScrapListItem: React.FC<{
  listItemsCollection: ListItemCollection;
  index: number;
  listItem: IScrapListItem;
  isEditMode: boolean;
  onChange: (listItem: IScrapListItem) => void;
}> = ({ listItemsCollection, index, isEditMode, listItem, onChange }) => {
  const [label, setLabel] = useState(listItem.label);
  const ref: React.MutableRefObject<HTMLInputElement> = useRef(null);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: listItemsCollection.getReactKey(index) });

  useEffect(
    () => listItemsCollection.setRef(index, ref),
    [listItemsCollection, index],
  );

  return (
    <ListItem
      sx={{
        paddingLeft: (listItem.depth ?? 0) * 20 + "px",
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      data-testid={`item-${index}:${listItem.depth ?? 0}`}
    >
      {isEditMode ? (
        <span
          ref={setNodeRef}
          style={{ height: "20px", padding: "7px", touchAction: "none" }}
          {...attributes}
          {...listeners}
        >
          <DragIndicator fontSize="small" style={{ cursor: "pointer" }} />
        </span>
      ) : null}
      <StyledCheckbox
        checked={listItem.isCompleted ?? false}
        onChange={(_, checked) => {
          onChange({ label, isCompleted: checked, depth: listItem.depth });
        }}
      />
      {isEditMode ? (
        <>
          <AutogrowTextField
            forwardInputRef={ref}
            isContent={true}
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            onKeyUp={keyUp}
            onKeyDown={keyDown}
            onBlur={() =>
              onChange({
                label,
                isCompleted: listItem.isCompleted,
                depth: listItem.depth,
              })
            }
            sx={{ ...getSx("textbox"), pr: 1, pt: "5px !important" }}
            autoFocus={!listItem.label}
          />
          <ActionIconButtonGroup
            backgroundColor={"none"}
            actions={[
              {
                key: "remove",
                label: "Delete",
                icon: <RemoveCircleOutline fontSize="small" />,
                onClick: () => listItemsCollection.removeItem(index),
              },
            ]}
          />
        </>
      ) : (
        <ReadonlyContainer sx={{ ...getSx("plain"), pt: "7px" }}>
          <Markdown value={label} useBasic={true}></Markdown>
        </ReadonlyContainer>
      )}
    </ListItem>
  );

  function getSx(elementType: "plain" | "textbox") {
    const sx: SxProps & { textarea?: SxProps } = { flexGrow: 1 };

    if (!listItem.isCompleted) {
      return sx;
    }

    switch (elementType) {
      case "textbox":
        sx.textarea = { textDecoration: "line-through" };
        break;
      case "plain":
        sx.textDecoration = "line-through";
        break;
    }

    return sx;
  }

  function keyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "ArrowUp": {
        if (e.altKey && e.ctrlKey) {
          listItemsCollection.moveItemUp(index);
        } else {
          listItemsCollection.moveFocusUp(index);
        }
        break;
      }

      case "ArrowDown": {
        if (e.altKey && e.ctrlKey) {
          listItemsCollection.moveItemDown(index);
        } else {
          listItemsCollection.moveFocusDown(index);
        }
        break;
      }

      case "ArrowRight": {
        if (e.altKey && e.ctrlKey) {
          listItemsCollection.moveItemRight(index);
        }
        break;
      }

      case "ArrowLeft": {
        if (e.altKey && e.ctrlKey) {
          listItemsCollection.moveItemLeft(index);
        }
        break;
      }

      case "Enter": {
        e.preventDefault();
        break;
      }

      case "Backspace": {
        const target = e.target as HTMLTextAreaElement;
        if (target.selectionStart !== target.selectionEnd) {
          return;
        }

        if (e.altKey && e.ctrlKey) {
          listItemsCollection.removeItem(index);
        }

        break;
      }
    }
  }

  function keyUp(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "Enter": {
        listItemsCollection.addItem(index);
        e.preventDefault();
        break;
      }

      case " ": {
        if (e.ctrlKey) {
          onChange({
            label,
            isCompleted: !listItem.isCompleted,
            depth: listItem.depth,
          });
        }
        break;
      }

      default: {
        onChange({
          label,
          isCompleted: listItem.isCompleted,
          depth: listItem.depth,
        });
        break;
      }
    }
  }
};

const StyledCheckbox = styled(Checkbox)`
  padding: 5px 5px 5px 0;

  &.MuiCheckbox-colorPrimary {
    color: ${(p) => p.theme.palette.primary.main} !important;
  }
`;

const ListItem = styled("li")`
  display: flex;
  align-items: start;
`;

const ReadonlyContainer = styled("div")`
  word-break: break-word;
`;
