import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { DateRange } from "./DateRange";

export const DateRangeSelector: React.FC<{
  dateRange: DateRange;
  onChange: (dateRange: DateRange) => void;
}> = ({ dateRange, onChange }) => {
  return (
    <FormControl margin="none" sx={{ flexGrow: 1, width: "100%" }}>
      <InputLabel id="date-range-label">Date Range</InputLabel>
      <Select
        id="date-range"
        labelId="date-range-label"
        label="Date Range"
        value={dateRange as unknown as string}
        onChange={(event: SelectChangeEvent) => {
          onChange(event.target.value as unknown as DateRange);
        }}
      >
        <MenuItem value={DateRange.Week}>Week</MenuItem>
        <MenuItem value={DateRange.Month}>Month</MenuItem>
        <MenuItem value={DateRange.Year}>Year</MenuItem>
        <MenuItem value={DateRange.All}>All</MenuItem>
        <MenuItem value={DateRange.Custom}>Custom</MenuItem>
      </Select>
    </FormControl>
  );
};
