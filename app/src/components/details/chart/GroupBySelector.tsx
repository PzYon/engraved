import { GroupBy } from "./consolidation/GroupBy";
import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { translations } from "../../../i18n/translations";

export const GroupBySelector: React.FC<{
  groupBy: GroupBy;
  onGroupingChange: (groupBy: GroupBy) => void;
}> = ({ groupBy, onGroupingChange }) => {
  return (
    <FormControl>
      <InputLabel id="group-by-label">{translations.label_groupBy}</InputLabel>
      <Select
        id="group-by"
        labelId="group-by-label"
        label="Group By"
        value={groupBy as unknown as string}
        onChange={(event: SelectChangeEvent) => {
          onGroupingChange(event.target.value as unknown as GroupBy);
        }}
      >
        <MenuItem value={GroupBy.Day}>{translations.groupBy_day}</MenuItem>
        <MenuItem value={GroupBy.Month}>{translations.groupBy_month}</MenuItem>
      </Select>
    </FormControl>
  );
};
