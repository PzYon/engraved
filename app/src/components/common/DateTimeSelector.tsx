import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField } from "@mui/material";
import React from "react";
import { removeTime } from "./utils";

export const DateTimeSelector: React.FC<{
  setDate: (date: Date) => void;
  date: Date;
}> = ({ setDate, date }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        renderInput={(params) => <TextField {...params} />}
        value={date}
        onChange={(d) => {
          const date = removeTime(d);
          setDate(date);
        }}
      />
    </LocalizationProvider>
  );
};
