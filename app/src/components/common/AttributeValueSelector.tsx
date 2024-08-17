import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { IJournalAttribute } from "../../serverApi/IJournalAttribute";

export const AttributeValueSelector: React.FC<{
  attribute: IJournalAttribute;
  selectedValue: string;
  onChange: (attributesValues: string[]) => void;
}> = ({ attribute, selectedValue, onChange }) => {
  if (!attribute) {
    return null;
  }

  return (
    <FormControl>
      <InputLabel id="attribute-values-label">Value</InputLabel>
      <Select
        id="attribute-values"
        label="Value"
        value={selectedValue}
        labelId="attribute-values-label"
        onChange={(event: SelectChangeEvent) => {
          onChange([event.target.value as unknown as string]);
        }}
      >
        {Object.entries(attribute.values).map((arr) => {
          return (
            <MenuItem value={arr[0]} key={arr[0]}>
              {arr[1]}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
