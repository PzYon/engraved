import { useEffect, useRef, useState } from "react";
import { OverviewItemCollection } from "../overviewList/wrappers/OverviewItemCollection";
import { useHotkeys } from "react-hotkeys-hook";
import { TextField } from "@mui/material";

export const GoToTextField: React.FC<{
  collection: OverviewItemCollection;
  value: string;
  onChange: (text: string) => void;
}> = ({ collection, value, onChange }) => {
  const textFieldRef = useRef<HTMLInputElement>(undefined);

  const [textFieldHasFocus, setTextFieldHasFocus] = useState(false);

  useHotkeys("alt+down", () => collection.setFocus(0), {
    enabled: textFieldHasFocus,
    enableOnFormTags: ["input"],
  });

  useEffect(() => {
    return collection.setOnType(() => textFieldRef.current.focus());
  }, [collection]);

  return (
    <TextField
      autoFocus={true}
      inputRef={textFieldRef}
      value={value}
      onFocus={() => setTextFieldHasFocus(true)}
      onBlur={() => setTextFieldHasFocus(false)}
      id={Math.random().toString()}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "100%" }}
    />
  );
};
