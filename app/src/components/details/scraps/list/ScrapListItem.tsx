import React, { useState } from "react";
import { ISCrapListItem } from "./IScrapListItem";
import { Checkbox, styled, TextField } from "@mui/material";
import { IconButtonWrapper } from "../../../common/IconButtonWrapper";
import { RemoveCircleOutline } from "@mui/icons-material";

export const ScrapListItem: React.FC<{
  isEditMode: boolean;
  listItem: ISCrapListItem;
  onChange: (listItem: ISCrapListItem) => void;
  onEnter: () => void;
}> = ({ isEditMode, listItem, onChange, onEnter }) => {
  const [label, setLabel] = useState(listItem.label);
  const [isCompleted, setIsCompleted] = useState(listItem.isCompleted);

  return (
    <>
      <StyledCheckbox
        checked={isCompleted}
        disabled={!isEditMode}
        onChange={(_, checked) => {
          setIsCompleted(checked);
          onChange({ label, isCompleted: checked });
        }}
      />
      <StyledTextField
        disabled={!isEditMode}
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        onKeyUp={keyUp}
        onBlur={() => onChange({ label, isCompleted: isCompleted })}
        variant="standard"
        autoComplete={"off"}
        sx={{ flexGrow: 1 }}
        autoFocus={!listItem.label}
      />
      <IconButtonWrapper
        action={{
          sx: !isEditMode ? { visibility: "hidden" } : null,
          isDisabled: !isEditMode,
          key: "remove",
          label: "Delete",
          icon: <RemoveCircleOutline fontSize={"small"} />,
          onClick: () => onChange(null),
        }}
      />
    </>
  );

  function keyUp(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "Enter":
        onEnter();
        break;
    }
  }
};

const StyledCheckbox = styled(Checkbox)`
  padding: 5px;

  &.MuiCheckbox-root.Mui-disabled.MuiCheckbox-colorPrimary {
    color: ${(p) => p.theme.palette.primary.main} !important;
  }
`;

const StyledTextField = styled(TextField)`
  input {
    padding: 2px 6px;

    &.Mui-disabled {
      -webkit-text-fill-color: ${(p) =>
        p.theme.palette.text.primary} !important;
    }
  }

  .MuiInput-root:before {
    border: 0 !important;
  }
`;
