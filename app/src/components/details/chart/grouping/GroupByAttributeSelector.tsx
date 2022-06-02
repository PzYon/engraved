import React from "react";
import { IMetricAttributes } from "../../../../serverApi/IMetricAttributes";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { translations } from "../../../../i18n/translations";

export const GroupByAttributeSelector: React.FC<{
  selectedAttributeKey: string;
  attributes: IMetricAttributes;
  onChange: (attributeKey: string) => void;
}> = ({ selectedAttributeKey, attributes, onChange }) => {
  return (
    <FormControl sx={{ minWidth: 150 }}>
      <InputLabel id="group-by-attribute-label">
        {translations.label_groupBy_attribute}
      </InputLabel>
      <Select
        id="group-by-attribute"
        labelId="group-by-attribute-label"
        label={translations.label_groupBy_time}
        value={selectedAttributeKey}
        onChange={(event: SelectChangeEvent) => {
          onChange(event.target.value as unknown as string);
        }}
      >
        <MenuItem value={""}>-</MenuItem>
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
};
