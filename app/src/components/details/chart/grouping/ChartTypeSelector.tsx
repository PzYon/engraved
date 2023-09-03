import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { translations } from "../../../../i18n/translations";

export type MyChartType = "bar" | "line" | "doughnut";

export const ChartTypeSelector: React.FC<{
  chartType: MyChartType;
  onChange: (chartType: MyChartType) => void;
}> = ({ chartType, onChange }) => {
  return (
    <FormControl sx={{ width: "100%" }}>
      <InputLabel id="chart-type-label">
        {translations.label_chartType}
      </InputLabel>
      <Select
        id="chart-type"
        labelId="chart-type-label"
        label={translations.label_groupBy_time}
        value={chartType}
        onChange={(event: SelectChangeEvent) => {
          onChange(event.target.value as MyChartType);
        }}
      >
        <MenuItem value="bar">Bar</MenuItem>
        <MenuItem value="line">Line</MenuItem>
        <MenuItem value="doughnut">Doughnut</MenuItem>
      </Select>
    </FormControl>
  );
};
