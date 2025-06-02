import { RefObject, useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { useEngravedHotkeys } from "../../common/actions/useEngravedHotkeys";

export const GoToTextField: React.FC<{
  value: string;
  onChange: (text: string) => void;
  onDownKey: () => void;
  inputRef: RefObject<HTMLInputElement>;
}> = ({ value, onChange, onDownKey, inputRef }) => {
  const [textFieldHasFocus, setTextFieldHasFocus] = useState(false);

  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    if (localValue !== value) {
      setLocalValue(value);
    }
  }, [value, localValue]);

  useEngravedHotkeys("down", () => onDownKey?.(), {
    enabled: textFieldHasFocus,
    enableOnFormTags: ["input"],
  });

  return (
    <TextField
      inputRef={inputRef}
      autoFocus={true}
      label={"Go to"}
      value={localValue}
      onFocus={() => setTextFieldHasFocus(true)}
      onBlur={() => setTextFieldHasFocus(false)}
      id={Math.random().toString()}
      onChange={(e) => {
        setLocalValue(e.target.value);
        onChange(e.target.value);
      }}
      style={{ width: "100%" }}
    />
  );
};
