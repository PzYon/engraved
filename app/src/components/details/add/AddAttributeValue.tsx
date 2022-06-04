import React, { useState } from "react";
import { InputAdornment, TextField } from "@mui/material";
import { Save } from "@mui/icons-material";

export const AddAttributeValue: React.FC<{
  label: string;
  onSave: (value: string) => void;
}> = ({ label, onSave }) => {
  const [attributeValue, setAttributeValue] = useState("");

  return (
    <TextField
      autoFocus={true}
      label={label}
      value={attributeValue}
      onChange={(event) => setAttributeValue(event.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Save
              sx={{ cursor: "pointer" }}
              onClick={() => onSave(attributeValue)}
            />
          </InputAdornment>
        ),
      }}
    />
  );
};
