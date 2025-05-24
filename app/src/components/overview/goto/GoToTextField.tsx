import { useRef, useState } from "react";
import { TextField } from "@mui/material";
import { useEngravedHotkeys } from "../../common/actions/useEngravedHotkeys";

export const GoToTextField: React.FC<{
  value: string;
  onChange: (text: string) => void;
}> = ({ value, onChange }) => {
  const textFieldRef = useRef<HTMLInputElement>(undefined);

  const [textFieldHasFocus, setTextFieldHasFocus] = useState(false);

  useEngravedHotkeys(
    "down",
    (e: KeyboardEvent) => {
      e.preventDefault();
      //collection.setFocus(0);
    },
    {
      enabled: textFieldHasFocus,
      enableOnFormTags: ["input"],
    },
  );

  return (
    <TextField
      autoFocus={true}
      inputRef={textFieldRef}
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
