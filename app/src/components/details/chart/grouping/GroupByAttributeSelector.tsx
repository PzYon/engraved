import React from "react";
import { IMetricAttributes } from "../../../../serverApi/IMetricAttributes";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

export const GroupByAttributeSelector: React.FC<{
  selectedAttributeKey: string;
  attributes: IMetricAttributes;
  onChange: (attributeKey: string) => void;
  label: string;
}> = ({ selectedAttributeKey, attributes, onChange, label }) => (
  <FormControl>
    <InputLabel id="group-by-attribute-label">{label}</InputLabel>
    <Select
      id="group-by-attribute"
      labelId="group-by-attribute-label"
      label={label}
      value={selectedAttributeKey}
      onChange={(event: SelectChangeEvent) => {
        onChange(event.target.value as unknown as string);
      }}
    >
      <MenuItem value={"-"}>-</MenuItem>
      {Object.keys(attributes).map((key) => {
        return (
          <MenuItem value={key} key={key}>
            {attributes[key].name}
          </MenuItem>
        );
      })}
    </Select>
  </FormControl>
);
