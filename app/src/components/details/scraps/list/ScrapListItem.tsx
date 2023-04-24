import React, { useState } from "react";
import { ISCrapListItem } from "./IScrapListItem";
import { Checkbox, styled, TextField } from "@mui/material";
import { IconButtonWrapper } from "../../../common/IconButtonWrapper";
import { RemoveCircleOutline } from "@mui/icons-material";
import { editModeKind } from "../Scrap";

export const ScrapListItem: React.FC<{
  editMode: editModeKind;
  listItem: ISCrapListItem;
  onChange: (listItem: ISCrapListItem) => void;
  onFocus: () => void;
  onEnter: () => void;
}> = ({ editMode, listItem, onChange, onFocus, onEnter }) => {
  const [label, setLabel] = useState(listItem.label);
  const [isCompleted, setIsCompleted] = useState(listItem.isCompleted);

  return (
    <>
      <StyledCheckbox
        checked={isCompleted}
        onChange={(_, checked) => {
          setIsCompleted(checked);
          onChange({ label, isCompleted: checked });
        }}
      />
      <StyledTextField
        onFocus={onFocus}
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
          sx: editMode === "off" ? { visibility: "hidden" } : null,
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
`;

const StyledTextField = styled(TextField)`
  input {
    padding: 2px 6px;
  }

  .MuiInput-root:before {
    border: 0 !important;
  }
`;
