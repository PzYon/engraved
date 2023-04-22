import React, { useEffect, useRef, useState } from "react";
import { ISCrapListItem } from "./IScrapListItem";
import { useScrapListContext } from "./ScrapListContext";
import { Checkbox, styled, TextField } from "@mui/material";

export const ScrapListItem: React.FC<{
  listItem: ISCrapListItem;
  index: number;
  onChange: (listItem: ISCrapListItem) => void;
  onKeyUp: (direction: "enter") => void;
}> = ({ listItem, index, onChange, onKeyUp }) => {
  const [label, setLabel] = useState(listItem.label);
  const [isCompleted, setIsCompleted] = useState(listItem.isCompleted);

  const inputRef = useRef<HTMLInputElement>();
  const ctx = useScrapListContext();

  useEffect(() => {
    ctx.setInputRef(index, inputRef);
  }, []);

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
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        onKeyUp={keyUp}
        onBlur={() => emitOnChange()}
        inputRef={inputRef}
        variant="standard"
        autoComplete={"off"}
        sx={{ flexGrow: 1 }}
        autoFocus={!listItem.label}
      />
    </>
  );

  function keyUp(e: React.KeyboardEvent<HTMLDivElement>) {
    switch (e.key) {
      case "Enter":
        onKeyUp("enter");
        break;
      case "ArrowUp":
        ctx.giveFocus(index - 1);
        break;
      case "ArrowDown":
        ctx.giveFocus(index + 1);
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
