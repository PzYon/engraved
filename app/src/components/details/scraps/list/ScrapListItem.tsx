import React, { useEffect, useRef, useState } from "react";
import { ISCrapListItem } from "./IScrapListItem";
import { Checkbox, styled } from "@mui/material";
import {
  FormatIndentDecrease,
  FormatIndentIncrease,
  RemoveCircleOutline,
} from "@mui/icons-material";
import { AutogrowTextField } from "../../../common/AutogrowTextField";
import { SxProps } from "@mui/system";
import { Markdown } from "../markdown/Markdown";
import { ActionIconButtonGroup } from "../../../common/actions/ActionIconButtonGroup";
import { ListItemCollection } from "./ListItemCollection";

export const ScrapListItem: React.FC<{
  listItemsCollection: ListItemCollection;
  index: number;
  listItem: ISCrapListItem;
  isEditMode: boolean;
  onChange: (listItem: ISCrapListItem) => void;
}> = ({ listItemsCollection, index, isEditMode, listItem, onChange }) => {
  const [label, setLabel] = useState(listItem.label);
  const ref: React.MutableRefObject<HTMLInputElement> = useRef(null);

  useEffect(
    () => listItemsCollection.setRef(index, ref),
    [listItemsCollection, index],
  );

  return (
    <ListItem sx={{ paddingLeft: (listItem.depth ?? 0) * 16 + "px" }}>
      <StyledCheckbox
        checked={listItem.isCompleted}
        onChange={(_, checked) => {
          onChange({ label, isCompleted: checked, depth: listItem.depth });
        }}
      />
      {isEditMode ? (
        <>
          <AutogrowTextField
            forwardInputRef={ref}
            fieldType="content"
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
            sx={{ ...getSx("textbox"), pr: 1 }}
            autoFocus={!listItem.label}
          />
          <ActionIconButtonGroup
            backgroundColor={"none"}
            actions={[
              {
                sx: !isEditMode ? { visibility: "hidden" } : null,
                key: "remove",
                label: "Delete",
                icon: <RemoveCircleOutline fontSize="small" />,
                onClick: () => listItemsCollection.removeItem(index),
              },
              {
                sx: !isEditMode ? { visibility: "hidden" } : null,
                key: "left",
                label: "Move left",
                icon: <FormatIndentDecrease fontSize="small" />,
                onClick: () => listItemsCollection.moveItemLeft(index),
              },
              {
                sx: !isEditMode ? { visibility: "hidden" } : null,
                key: "right",
                label: "Move right",
                icon: <FormatIndentIncrease fontSize="small" />,
                onClick: () => listItemsCollection.moveItemRight(index),
              },
            ]}
          />
        </>
      ) : (
        <ReadonlyContainer sx={getSx("plain")}>
          <Markdown value={label} useBasic={true}></Markdown>
        </ReadonlyContainer>
      )}
    </ListItem>
  );

  function getSx(elementType: "plain" | "textbox") {
    const sx: SxProps = {
      flexGrow: 1,
      marginTop: elementType === "plain" ? "8px" : "6px",
    };

    if (elementType === "textbox") {
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      (sx as any).textarea = {
        lineHeight: "21px",
      };
    }

    if (!listItem.isCompleted) {
      return sx;
    }

    if (elementType === "textbox") {
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      (sx as any).textarea = {
        textDecoration: "line-through",
      };
    } else if (elementType === "plain") {
      sx.textDecoration = "line-through";
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

  &.MuiCheckbox-root.Mui-disabled.MuiCheckbox-colorPrimary {
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
