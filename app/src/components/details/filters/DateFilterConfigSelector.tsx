import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  TextField,
} from "@mui/material";
import { DateRange } from "./DateRange";
import { DateRangeSelector } from "./DateRangeSelector";
import React from "react";
import { DateType } from "./DateFilters";
import { DateFilterConfig } from "../edit/IJournalUiSettings";

export const DateFilterConfigSelector: React.FC<{
  dateFilterConfig: DateFilterConfig;
  setDateFilterConfig: (config: DateFilterConfig) => void;
}> = ({ dateFilterConfig, setDateFilterConfig }) => {
  return (
    <Host>
      <FormControl margin={"normal"} sx={{ mt: 0, flexGrow: 1 }}>
        <InputLabel id="date-type-label">Type</InputLabel>
        <Select
          id="date-type"
          labelId="date-type-label"
          label="Date filter type"
          value={dateFilterConfig.dateType as unknown as string}
          onChange={(event: SelectChangeEvent) => {
            const type = event.target.value as unknown as DateType;

            setDateFilterConfig({
              dateType: type,
              value: type === "range" ? DateRange.All : 90,
            });
          }}
          sx={{ ".MuiSelect-select": { display: "flex" } }}
        >
          <MenuItem value="relative">Relative to now</MenuItem>
          <MenuItem value="range">Range</MenuItem>
        </Select>
      </FormControl>

      <RangeContainer>
        {dateFilterConfig.dateType === "range" ? (
          <DateRangeSelector
            dateRange={dateFilterConfig.value}
            onChange={(x) => {
              setDateFilterConfig({
                dateType: "range",
                value: x,
              });
            }}
          />
        ) : (
          <TextField
            label="Last n days"
            type="number"
            defaultValue={dateFilterConfig.value}
            onBlur={(x) => {
              const days = Number(x.target.value);

              setDateFilterConfig({
                dateType: "relative",
                value: days,
              });
            }}
          />
        )}
      </RangeContainer>
    </Host>
  );
};

const Host = styled("div")`
  display: flex;
  gap: ${(p) => p.theme.spacing(2)};
`;

const RangeContainer = styled("div")`
  display: flex;
  flex-grow: 1;
`;
