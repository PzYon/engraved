import { GroupByTime } from "../consolidation/GroupByTime";
import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { translations } from "../../../../i18n/translations";
import { SxProps } from "@mui/system";
import { Theme } from "@mui/material/styles";

export const GroupByTimeSelector: React.FC<{
  groupByTime: GroupByTime;
  onChange: (groupByTime: GroupByTime) => void;
  sx?: SxProps<Theme>;
}> = ({ groupByTime, onChange, sx }) => {
  return (
    <FormControl sx={sx}>
      <InputLabel id="group-by-time-label">
        {translations.label_groupBy_time}
      </InputLabel>
      <Select
        id="group-by-time"
        labelId="group-by-time-label"
        label={translations.label_groupBy_time}
        value={groupByTime as unknown as string}
        onChange={(event: SelectChangeEvent) => {
          onChange(event.target.value as unknown as GroupByTime);
        }}
      >
        <MenuItem value={GroupByTime.Day}>{translations.groupBy_day}</MenuItem>
        <MenuItem value={GroupByTime.Month}>
          {translations.groupBy_month}
        </MenuItem>
      </Select>
    </FormControl>
  );
};
