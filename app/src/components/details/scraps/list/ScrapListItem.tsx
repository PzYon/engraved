import React, { useEffect, useRef, useState } from "react";
import { ISCrapListItem } from "./IScrapListItem";
import { Checkbox, styled } from "@mui/material";
import { ActionIconButton } from "../../../common/actions/ActionIconButton";
import { RemoveCircleOutline } from "@mui/icons-material";
import { AutogrowTextField } from "../../../common/AutogrowTextField";
import { ListItemWrapper } from "./ListItemWrapper";
import { SxProps } from "@mui/system";
import { Markdown } from "../markdown/Markdown";

export const ScrapListItem: React.FC<{
  isEditMode: boolean;
  listItemWrapper: ListItemWrapper;
  onChange: (listItem: ISCrapListItem) => void;
  onEnter: () => void;
  onDelete: () => void;
  moveFocusDown: () => void;
  moveFocusUp: () => void;
  moveItemUp: () => void;
  moveItemDown: () => void;
}> = ({
  isEditMode,
  listItemWrapper,
  onChange,
  onEnter,
  onDelete,
  moveFocusDown,
  moveFocusUp,
  moveItemUp,
  moveItemDown,
}) => {
  const listItem = listItemWrapper.raw;

  const [label, setLabel] = useState(listItem.label);
  const ref: React.MutableRefObject<HTMLInputElement> = useRef(null);

  useEffect(() => listItemWrapper.setRef(ref), [listItemWrapper]);

  return (
    <ListItem>
      <StyledCheckbox
        checked={listItem.isCompleted}
        disabled={!isEditMode}
        onChange={(_, checked) => {
          onChange({ label, isCompleted: checked });
        }}
      />
      {isEditMode ? (
        <AutogrowTextField
          forwardInputRef={ref}
          fieldType="content"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          onKeyUp={keyUp}
          onKeyDown={keyDown}
          onBlur={() => onChange({ label, isCompleted: listItem.isCompleted })}
          sx={getSx("textbox")}
          autoFocus={!listItem.label}
        />
      ) : (
        <ReadonlyContainer sx={getSx("plain")}>
          <Markdown value={label} useBasic={true}></Markdown>
        </ReadonlyContainer>
      )}

      <ActionIconButton
        action={{
          sx: !isEditMode ? { visibility: "hidden" } : null,
          isDisabled: !isEditMode,
          key: "remove",
          label: "Delete",
          icon: <RemoveCircleOutline fontSize="small" />,
          onClick: () => onDelete(),
        }}
      />
    </ListItem>
  );

  function getSx(elementType: "plain" | "textbox") {
    const sx: SxProps = {
      flexGrow: 1,
      marginTop: elementType === "plain" ? "8px" : "6px",
    };

    if (!listItem.isCompleted) {
      return sx;
    }

    if (elementType === "textbox") {
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      (sx as any).textarea = { textDecoration: "line-through" };
    } else if (elementType === "plain") {
      sx.textDecoration = "line-through";
    }

    return sx;
  }

  function keyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "ArrowUp": {
        if (e.altKey && e.ctrlKey) {
          moveItemUp();
        } else {
          moveFocusUp();
        }
        break;
      }

      case "ArrowDown": {
        if (e.altKey && e.ctrlKey) {
          moveItemDown();
        } else {
          moveFocusDown();
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
          onDelete();
        }

        break;
      }
    }
  }

  function keyUp(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "Enter": {
        onEnter();
        e.preventDefault();
        break;
      }

      case " ": {
        if (e.ctrlKey) {
          onChange({ label, isCompleted: !listItem.isCompleted });
        }
        break;
      }

      default: {
        onChange({ label, isCompleted: listItem.isCompleted });
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
