import { RefObject, useState } from "react";
import { TextField } from "@mui/material";
import { useEngravedHotkeys } from "../../common/actions/useEngravedHotkeys";

export const GoToTextField: React.FC<{
  initialValue: string;
  onChange: (text: string) => void;
  onDownKey: () => void;
  inputRef: RefObject<HTMLInputElement>;
}> = ({ initialValue, onChange, onDownKey, inputRef }) => {
  const [textFieldHasFocus, setTextFieldHasFocus] = useState(false);

  useEngravedHotkeys("down", () => onDownKey?.(), {
    enabled: textFieldHasFocus,
    enableOnFormTags: ["input"],
  });

  return (
    <TextField
      inputRef={inputRef}
      autoFocus={true}
      label={"Go to"}
      defaultValue={initialValue}
      onFocus={() => setTextFieldHasFocus(true)}
      onBlur={() => setTextFieldHasFocus(false)}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "100%" }}
    />
  );
};
