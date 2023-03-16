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
      <InputLabel id="metric-type-label">
        {translations.label_metricType}
      </InputLabel>
      <Select
        id="metric-type"
        labelId="metric-type-label"
        label={translations.label_metricType}
        value={metricType as unknown as string}
        onChange={(event: SelectChangeEvent) => {
          onChange(event.target.value as unknown as MetricType);
        }}
      >
        <MenuItem value={MetricType.Scraps}>
          {translations.metricType_scraps}
        </MenuItem>
        <MenuItem value={MetricType.Notes}>
          {translations.metricType_notes}
        </MenuItem>
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
