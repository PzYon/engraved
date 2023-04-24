import React, { useState } from "react";
import { ISCrapListItem } from "./IScrapListItem";
import { Checkbox, styled, TextField } from "@mui/material";
import { IconButtonWrapper } from "../../../common/IconButtonWrapper";
import { RemoveCircleOutline } from "@mui/icons-material";

export const ScrapListItem: React.FC<{
  listItem: ISCrapListItem;
  onChange: (listItem: ISCrapListItem) => void;
  onFocus: () => void;
  onEnter: () => void;
  onDelete: () => void;
}> = ({ listItem, onChange, onFocus, onEnter, onDelete }) => {
  const [label, setLabel] = useState(listItem.label);
  const [isCompleted, setIsCompleted] = useState(listItem.isCompleted);

  return (
    <>
      <StyledCheckbox
        checked={isCompleted}
        onChange={(_, checked) => {
          setIsCompleted(checked);
          emitOnChange(checked);
        }}
      />
      <StyledTextField
        onFocus={onFocus}
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        onKeyUp={keyUp}
        onBlur={() => emitOnChange()}
        variant="standard"
        autoComplete={"off"}
        sx={{ flexGrow: 1 }}
        autoFocus={!listItem.label}
      />
      <IconButtonWrapper
        action={{
          key: "remove",
          label: "Delete",
          icon: <RemoveCircleOutline fontSize={"small"} />,
          onClick: onDelete,
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

  function emitOnChange(isCompletedOverride: boolean = undefined) {
    onChange({
      label,
      isCompleted:
        isCompletedOverride === undefined ? isCompleted : isCompletedOverride,
    });
  }
};

const StyledCheckbox = styled(Checkbox)`
  padding: 5px;
`;

const StyledTextField = styled(TextField)`
  input {
    padding: 2px 6px;
  }
`;
