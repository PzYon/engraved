import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { translations } from "../../../../i18n/translations";

export const ChartTypeSelector: React.FC<{
  chartType: string;
  onChange: (chartType: string) => void;
}> = ({ chartType, onChange }) => {
  return (
    <FormControl>
      <InputLabel id="chart-type-label">
        {translations.label_chartType}
      </InputLabel>
      <Select
        id="chart-type"
        labelId="chart-type-label"
        label={translations.label_groupBy_time}
        value={chartType}
        onChange={(event: SelectChangeEvent) => {
          onChange(event.target.value);
        }}
      >
        <MenuItem value="bar">Bar</MenuItem>
        <MenuItem value="line">Line</MenuItem>
        <MenuItem value="doughnut">Doughnut</MenuItem>
      </Select>
    </FormControl>
  );
};
