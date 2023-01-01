import React, { useState } from "react";
import { DateSelector } from "../../common/DateSelector";
import { useMetricContext } from "../MetricDetailsContext";
import { styled } from "@mui/material";
import {
  createDateConditions,
  createNextDateConditions,
} from "./createDateConditions";
import { IconButtonWrapper } from "../../common/IconButtonWrapper";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { DateRangeSelector } from "./DateRangeSelector";

export enum DateRange {
  Week,
  Month,
  Year,
  All,
  Custom,
}

const defaultDateRange = DateRange.Month;

export const getDefaultDateConditions = () => {
  return createDateConditions(defaultDateRange, new Date());
};

export const DateFilters: React.FC = () => {
  const { dateConditions, setDateConditions } = useMetricContext();

  const [dateRange, setDateRange] = useState<DateRange>(defaultDateRange);

  return (
    <>
      <RangeContainer>
        <DateRangeSelector dateRange={dateRange} onChange={onChange} />
        <IconButtonWrapper
          action={{
            onClick: () =>
              setDateConditions(
                createNextDateConditions("previous", dateRange, dateConditions)
              ),
            icon: <ChevronLeft fontSize="small" />,
            label: "Previous",
            key: "go_left",
          }}
        />
        <IconButtonWrapper
          action={{
            onClick: () =>
              setDateConditions(
                createNextDateConditions("next", dateRange, dateConditions)
              ),
            icon: <ChevronRight fontSize="small" />,
            label: "Previous",
            key: "go_left",
          }}
        />
      </RangeContainer>
      <DateSelector
        label="From"
        date={dateConditions.from}
        setDate={(d) => {
          setDateConditions({ ...dateConditions, from: d });
          setDateRange(DateRange.Custom);
        }}
      />
      <DateSelector
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

    const conditions = createDateConditions(
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
