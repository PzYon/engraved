import { RefObject, useState } from "react";
import { TextField } from "@mui/material";
import { useEngravedHotkeys } from "../../common/actions/useEngravedHotkeys";

export const GoToTextField: React.FC<{
  value: string;
  onChange: (text: string) => void;
  onDownKey: () => void;
  inputRef: RefObject<HTMLInputElement>;
}> = ({ value, onChange, onDownKey, inputRef }) => {
  const [textFieldHasFocus, setTextFieldHasFocus] = useState(false);

  useEngravedHotkeys(
    "down",
    (e: KeyboardEvent) => {
      e.preventDefault();
      console.log("Should set focus to first list item element");
      onDownKey?.();
    },
    {
      enabled: textFieldHasFocus,
      enableOnFormTags: ["input"],
    },
  );

  return (
    <TextField
      inputRef={inputRef}
      defaultValue={value}
      label={"Go to"}
      onFocus={() => setTextFieldHasFocus(true)}
      onBlur={() => setTextFieldHasFocus(false)}
      id={Math.random().toString()}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "100%" }}
    />
  );
};
