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
  Week,
  Month,
  Year,
  All,
  Custom,
}

const defaultDateRange = DateRange.Month;

export const getDefaultDateConditions = () => {
  return calculateDateRange(defaultDateRange, new Date());
};

export const DateConditions: React.FC = () => {
  const { dateConditions, setDateConditions } = useMetricDetailsContext();

  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange);

  return (
    <>
      <DateTimeSelector
        label="From"
        date={dateConditions.from}
        setDate={(d) => {
          setDateConditions({ ...dateConditions, from: d });
          setDateRange(DateRange.Custom);
        }}
      />
      <DateTimeSelector
        label="To"
        date={dateConditions.to}
        setDate={(d) => {
          setDateConditions({ ...dateConditions, to: d });
          setDateRange(DateRange.Custom);
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
          <MenuItem value={DateRange.Week}>Week</MenuItem>
          <MenuItem value={DateRange.Month}>Month</MenuItem>
          <MenuItem value={DateRange.Year}>Year</MenuItem>
          <MenuItem value={DateRange.All}>All</MenuItem>
          <MenuItem value={DateRange.Custom}>Custom</MenuItem>
        </Select>
      </FormControl>
    </>
  );

  function onChange(range: DateRange): void {
    setDateRange(range);

    const conditions = calculateDateRange(
      range,
      dateConditions.from ?? new Date()
    );

    if (!conditions) {
      return;
    }

    setDateConditions(conditions);
  }
};
