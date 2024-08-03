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
import { journalDefaultUiSettings } from "../journalDefaultUiSettings";
import { DateRange } from "./DateRange";
import { FiltersRow } from "./FiltersRow";
import { DateFilterConfigSelector } from "./DateFilterConfigSelector";
import { DeviceWidth, useDeviceWidth } from "../../common/useDeviceWidth";

export type DateType = "relative" | "range";

// todo:
// - naming (is "relative" and "range" good?)
// - "last n days" must grow

export const DateFilters: React.FC = () => {
  const { dateConditions, setDateConditions } = useJournalContext();

  const [dateFilterConfig, setDateFilterConfig] = useState(
    journalDefaultUiSettings.dateFilter,
  );

  const deviceWidth = useDeviceWidth();

  return (
    <Host
      sx={{
        flexDirection: deviceWidth === DeviceWidth.Small ? "column" : "row",
      }}
    >
      <FiltersRow>
        <DateFilterConfigSelector
          dateFilterConfig={dateFilterConfig}
          setDateFilterConfig={(c) => {
            setDateFilterConfig(c);

            const relevantDate =
              c.dateType === "relative" && c.value !== dateFilterConfig.value
                ? new Date()
                : (dateConditions.from ?? new Date());

            setDateConditions(createDateConditions(c, relevantDate));
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

const Host = styled("div")``;

const StepperContainer = styled("div")`
  flex-shrink: 1 !important;
  flex-grow: initial !important;
  display: flex;
  justify-content: center;
  height: 56px;
`;

const PickerContainer = styled("div")`
  flex-grow: 2;
`;
