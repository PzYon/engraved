import React, { useState } from "react";
import { DateTimeSelector } from "../../common/DateTimeSelector";
import { useMetricContext } from "../MetricDetailsContext";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
} from "@mui/material";
import { dateRangeFunctions, getDateCondition } from "./dateRangeFunctions";
import { IconButtonWrapper } from "../../common/IconButtonWrapper";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

export enum DateRange {
  Week,
  Month,
  Year,
  All,
  Custom,
}

const defaultDateRange = DateRange.Month;

export const getDefaultDateConditions = () => {
  return dateRangeFunctions(defaultDateRange, new Date());
};

export const DateFilters: React.FC = () => {
  const { dateConditions, setDateConditions } = useMetricContext();

  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange);

  return (
    <>
      <RangeContainer>
        <FormControl margin="none" sx={{ flexGrow: 1 }}>
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
        <IconButtonWrapper
          action={{
            onClick: () =>
              setDateConditions(
                getDateCondition("previous", dateRange, dateConditions)
              ),
            icon: <ChevronLeft />,
            label: "Previous",
            key: "go_left",
          }}
        />
        <IconButtonWrapper
          action={{
            onClick: () =>
              setDateConditions(
                getDateCondition("next", dateRange, dateConditions)
              ),
            icon: <ChevronRight />,
            label: "Previous",
            key: "go_left",
          }}
        />
      </RangeContainer>
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
    </>
  );

  function onChange(range: DateRange): void {
    setDateRange(range);

    const conditions = dateRangeFunctions(
      range,
      dateConditions.from ?? new Date()
    );

    if (!conditions) {
      return;
    }

    setDateConditions(conditions);
  }
};

const RangeContainer = styled("div")`
  display: flex;
`;
