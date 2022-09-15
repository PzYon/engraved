import React, { useState } from "react";
import { DateTimeSelector } from "../../../common/DateTimeSelector";
import { useMetricDetailsContext } from "../../MetricDetailsContext";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { calculateDateRange } from "./calculateDateRange";

export enum DateRange {
  All,
  Week,
  Month,
  Year,
}

export const DateConditions: React.FC = () => {
  const { dateConditions, setDateConditions } = useMetricDetailsContext();

  const [dateRange, setDateRange] = useState<DateRange>(DateRange.Month);

  return (
    <>
      <DateTimeSelector
        label="From"
        date={dateConditions.from}
        setDate={(d) => {
          setDateConditions({ ...dateConditions, from: d });
        }}
      />
      <DateTimeSelector
        label="To"
        date={dateConditions.to}
        setDate={(d) => {
          setDateConditions({ ...dateConditions, to: d });
        }}
      />
      <FormControl margin="none">
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
          <MenuItem value={DateRange.All}>All</MenuItem>
          <MenuItem value={DateRange.Week}>Week</MenuItem>
          <MenuItem value={DateRange.Month}>Month</MenuItem>
          <MenuItem value={DateRange.Year}>Year</MenuItem>
        </Select>
      </FormControl>
    </>
  );

  function onChange(range: DateRange): void {
    setDateRange(range);
    setDateConditions(
      calculateDateRange(range, dateConditions.from ?? new Date())
    );
  }
};
