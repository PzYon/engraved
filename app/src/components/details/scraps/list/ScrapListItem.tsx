import React, { useState } from "react";
import { ISCrapListItem } from "./IScrapListItem";
import { Checkbox, styled } from "@mui/material";
import { IconButtonWrapper } from "../../../common/IconButtonWrapper";
import { RemoveCircleOutline } from "@mui/icons-material";
import { AutogrowTextField } from "../../../common/AutogrowTextField";

export const ScrapListItem: React.FC<{
  isEditMode: boolean;
  listItem: ISCrapListItem;
  onChange: (listItem: ISCrapListItem) => void;
  onEnter: () => void;
  onDelete: () => void;
}> = ({ isEditMode, listItem, onChange, onEnter, onDelete }) => {
  const [label, setLabel] = useState(listItem.label);
  const [isCompleted, setIsCompleted] = useState(listItem.isCompleted);

  return (
    <ListItem>
      <StyledCheckbox
        checked={isCompleted}
        disabled={!isEditMode}
        onChange={(_, checked) => {
          setIsCompleted(checked);
          onChange({ label, isCompleted: checked });
        }}
      />
      <AutogrowTextField
        fieldType="content"
        disabled={!isEditMode}
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        onKeyUp={keyUp}
        onKeyDown={keyDown}
        onBlur={() => onChange({ label, isCompleted: isCompleted })}
        sx={{
          flexGrow: 1,
          marginTop: "6px",
          textarea: {
            textDecoration: isCompleted ? "line-through" : "none",
          },
        }}
        autoFocus={!listItem.label}
      />
      <IconButtonWrapper
        action={{
          sx: !isEditMode ? { visibility: "hidden" } : null,
          isDisabled: !isEditMode,
          key: "remove",
          label: "Delete",
          icon: <RemoveCircleOutline fontSize="small" />,
          onClick: () => onChange(null),
        }}
      />
    </ListItem>
  );

  function keyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        break;

      case "Delete":
        const target = e.target as HTMLTextAreaElement;
        if (target.selectionStart !== target.selectionEnd) {
          return;
        }

        onDelete();

        break;
    }
  }

  function keyUp(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "Enter":
        onEnter();
        e.preventDefault();

        break;
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
