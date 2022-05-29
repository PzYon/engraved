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

export const GroupByTimeSelector: React.FC<{
  groupByTime: GroupByTime;
  onGroupingChange: (groupByTime: GroupByTime) => void;
}> = ({ groupByTime, onGroupingChange }) => {
  return (
    <FormControl sx={{ minWidth: 150, marginRight: "20px" }}>
      <InputLabel id="group-by-label">
        {translations.label_groupBy_time}
      </InputLabel>
      <Select
        id="group-by-time"
        labelId="group-by-label"
        label={translations.label_groupBy_time}
        value={groupByTime as unknown as string}
        onChange={(event: SelectChangeEvent) => {
          onGroupingChange(event.target.value as unknown as GroupByTime);
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
