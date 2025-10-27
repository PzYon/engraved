import React, { useState } from "react";
import { IScrapListItem } from "./IScrapListItem";
import { Checkbox, styled, SxProps } from "@mui/material";
import DragIndicator from "@mui/icons-material/DragIndicator";
import RemoveCircleOutline from "@mui/icons-material/RemoveCircleOutline";
import { Markdown } from "../markdown/Markdown";
import { ActionIconButtonGroup } from "../../../common/actions/ActionIconButtonGroup";
import { ListItemCollection } from "./ListItemCollection";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TextEditorNew } from "../../../common/TextEditorNew";

export const ScrapListItem: React.FC<{
  listItemsCollection: ListItemCollection;
  index: number;
  listItem: IScrapListItem;
  isEditMode: boolean;
  onChange: (listItem: IScrapListItem) => void;
}> = ({ listItemsCollection, index, isEditMode, listItem, onChange }) => {
  const [label, setLabel] = useState(listItem.label);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: listItemsCollection.getReactKey(index) });

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
        onChange={(
          _: React.ChangeEvent<HTMLInputElement>,
          checked: boolean,
        ) => {
          onChange({ label, isCompleted: checked, depth: listItem.depth });
        }}
      />
      {isEditMode ? (
        <>
          <TextEditorNew
            css={getCss() as React.CSSProperties}
            initialValue={label}
            setValue={setLabel}
            onKeyUp={keyUp}
            onKeyDown={keyDown}
            setGiveFocus={(giveFocus: () => void) => {
              listItemsCollection.setGiveFocus(index, giveFocus);
            }}
            onBlur={() =>
              onChange({
                label,
                isCompleted: listItem.isCompleted,
                depth: listItem.depth,
              })
            }
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
        <ReadonlyContainer sx={{ ...getCss(), pt: "7px" }}>
          <Markdown value={label} useBasic={true}></Markdown>
        </ReadonlyContainer>
      )}
    </ListItem>
  );

  function getCss(): React.CSSProperties | SxProps {
    const css: React.CSSProperties | SxProps = { flexGrow: 1 };

    if (listItem.isCompleted) {
      css.textDecoration = "line-through";
    }

    return css;
  }

  function keyDown(e: KeyboardEvent) {
    switch (e.key) {
      case "ArrowUp": {
        if (e.altKey && e.ctrlKey) {
          listItemsCollection.moveItemUp(index);
        } else {
          listItemsCollection.moveFocusUp(index, "end");
        }
        break;
      }

      case "ArrowDown": {
        if (e.altKey && e.ctrlKey) {
          listItemsCollection.moveItemDown(index);
        } else {
          listItemsCollection.moveFocusDown(index, "end");
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
        const target = e.target as HTMLDivElement;

        if (
          target.innerText === undefined ||
          target.innerText === null ||
          target.innerText?.trim() === ""
        ) {
          listItemsCollection.removeItem(index);
          listItemsCollection.moveFocusUp(index, "end");
          return;
        }

        // if (target.selectionStart !== target.selectionEnd) {
        //   return;
        // }

        if (e.altKey && e.ctrlKey) {
          listItemsCollection.removeItem(index);
          listItemsCollection.moveFocusUp(index, "end");
        }

        break;
      }
    }
  }

  function keyUp(e: KeyboardEvent) {
    switch (e.key) {
      case "Enter": {
        listItemsCollection.addItem(index);
        //listItemsCollection.moveFocusDown(index, "end");
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
