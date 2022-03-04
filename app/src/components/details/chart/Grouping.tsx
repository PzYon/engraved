import { GroupBy } from "./consolidation/GroupBy";
import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

export const Grouping: React.FC<{
  groupBy: GroupBy;
  onGroupingChange: (groupBy: GroupBy) => void;
}> = ({ groupBy, onGroupingChange }) => {
  return (
    <FormControl>
      <InputLabel id="group-by-label">Group By</InputLabel>
      <Select
        id="group-by"
        labelId="group-by-label"
        label="Group By"
        value={groupBy as unknown as string}
        onChange={(event: SelectChangeEvent) => {
          onGroupingChange(event.target.value as unknown as GroupBy);
        }}
      >
        <MenuItem value={GroupBy.Day}>Day</MenuItem>
        <MenuItem value={GroupBy.Month}>Month</MenuItem>
      </Select>
    </FormControl>
  );
};
