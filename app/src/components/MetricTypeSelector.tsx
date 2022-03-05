import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { MetricType } from "../serverApi/MetricType";
import { translations } from "../i18n/translations";

export const MetricTypeSelector: React.FC<{
  metricType: MetricType;
  onChange: (metricType: MetricType) => void;
}> = ({ metricType, onChange }) => {
  return (
    <FormControl margin="normal">
      <InputLabel id="group-by-label">{translations.label_groupBy}</InputLabel>
      <Select
        id="group-by"
        labelId="group-by-label"
        label="Group By"
        value={metricType as unknown as string}
        onChange={(event: SelectChangeEvent) => {
          onChange(event.target.value as unknown as MetricType);
        }}
      >
        <MenuItem value={MetricType.Counter}>
          {translations.metricType_counter}
        </MenuItem>
        <MenuItem value={MetricType.Gauge}>
          {translations.metricType_gauge}
        </MenuItem>
        <MenuItem value={MetricType.Timer}>
          {translations.metricType_timer}
        </MenuItem>
      </Select>
    </FormControl>
  );
};
