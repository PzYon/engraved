import React, { useState } from "react";
import { DateSelector } from "../../common/DateSelector";
import { useJournalContext } from "../JournalContext";
import { styled } from "@mui/material";
import {
  createDateConditions,
  createNextDateConditions,
} from "./createDateConditions";
import { ActionIconButton } from "../../common/actions/ActionIconButton";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { DateRange } from "./DateRange";
import { FiltersRow } from "./FiltersRow";
import { DateFilterConfigSelector } from "./DateFilterConfigSelector";
import { DeviceWidth, useDeviceWidth } from "../../common/useDeviceWidth";
import { DateFilterConfig } from "../edit/IJournalUiSettings";

export type DateType = "relative" | "range";

export const DateFilters: React.FC<{ config: DateFilterConfig }> = ({
  config,
}) => {
  const { dateConditions, setDateConditions } = useJournalContext();

  const [dateFilterConfig, setDateFilterConfig] = useState(config);

  const deviceWidth = useDeviceWidth();

  return (
    <Host
      sx={{
        flexDirection: deviceWidth === DeviceWidth.Small ? "column" : "row",
      }}
    >
      <FiltersRow
        sx={{
          flexGrow: 1,
          mb: deviceWidth === DeviceWidth.Small ? 2 : 0,
          mr: deviceWidth === DeviceWidth.Small ? 0 : 2,
        }}
      >
        <DateFilterConfigSelector
          dateFilterConfig={dateFilterConfig}
          setDateFilterConfig={(c) => {
            const relevantDate =
              c.dateType === "relative" && c.value !== dateFilterConfig.value
                ? new Date()
                : (dateConditions.from ?? new Date());

            setDateConditions(createDateConditions(c, relevantDate));
            setDateFilterConfig(c);
          }}
        />
      </FiltersRow>

      <FiltersRow>
        <StepperContainer>
          <ActionIconButton
            action={{
              onClick: () =>
                setDateConditions(
                  createNextDateConditions(
                    "previous",
                    dateFilterConfig,
                    dateConditions,
                  ),
                ),
              icon: <ChevronLeft fontSize="small" />,
              label: "Previous",
              key: "go_left",
            }}
          />
          <ActionIconButton
            action={{
              onClick: () =>
                setDateConditions(
                  createNextDateConditions(
                    "next",
                    dateFilterConfig,
                    dateConditions,
                  ),
                ),
              icon: <ChevronRight fontSize="small" />,
              label: "Next",
              key: "go_left",
            }}
          />
        </StepperContainer>
        <PickerContainer>
          <DateSelector
            label="From"
            date={dateConditions?.from}
            setDate={(d) => {
              setDateConditions({ ...dateConditions, from: d });
              setDateFilterConfig({
                dateType: "range",
                value: DateRange.Custom,
              });
            }}
          />
        </PickerContainer>
        <PickerContainer>
          <DateSelector
            label="To"
            date={dateConditions?.to}
            setDate={(d) => {
              setDateConditions({ ...dateConditions, to: d });
              setDateFilterConfig({
                dateType: "range",
                value: DateRange.Custom,
              });
            }}
          />
        </PickerContainer>
      </FiltersRow>
    </Host>
  );
};

const Host = styled("div")`
  max-width: 100%;
`;

const StepperContainer = styled("div")`
  display: flex;
  justify-content: center;
  height: 56px;
`;

const PickerContainer = styled("div")`
  flex-grow: 2 !important;
  flex-shrink: 2 !important;

  .MuiPickersSectionList-root,
  .MuiPickersTextField-root {
    width: 100% !important;
  }
`;
