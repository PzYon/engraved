import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { AggregationMode } from "../edit/IJournalUiSettings";

export const AggregationModeSelector: React.FC<{
  aggregationMode: AggregationMode;
  onChange: (aggregationMode: AggregationMode) => void;
}> = ({ aggregationMode, onChange }) => {
  return (
    <FormControl sx={{ width: "100%" }}>
      <InputLabel id="aggregation-mode-label">Aggregation mode</InputLabel>
      <Select
        id="aggregation-mode"
        labelId="aggregation-mode-label"
        label="Aggregation mode"
        value={aggregationMode}
        onChange={(event: SelectChangeEvent) => {
          onChange(event.target.value as AggregationMode);
        }}
      >
        <MenuItem value="sum">Sum</MenuItem>
        <MenuItem value="average">Average</MenuItem>
      </Select>
    </FormControl>
  );
};
