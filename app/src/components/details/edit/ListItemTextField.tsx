import React, { useState } from "react";
import { TextField } from "@mui/material";

export const ListItemTextField: React.FC<{
  defaultValue?: string;
  onBlur?: (newValue: string) => void;
  isExisting?: boolean;
}> = ({ defaultValue, onBlur, isExisting }) => {
  const [disabled, setDisabled] = useState(isExisting);

  const [value, setValue] = useState(defaultValue);

  return (
    <TextField
      value={value}
      disabled={disabled}
      size="small"
      onChange={(event) => setValue(event.target.value)}
      onClick={() => setDisabled(false)}
      onBlur={(event) => {
        const newValue = event.target.value;
        if (!newValue) {
          return;
        }

        onBlur(newValue);

        if (isExisting) {
          setDisabled(true);
          return;
        }

        setValue("");
      }}
    />
  );
};
