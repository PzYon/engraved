import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField } from "@mui/material";
import React from "react";
import { stripTime } from "./utils";

export const DateTimeSelector: React.FC<{
  setDate: (date: Date) => void;
  date: Date;
  label?: string;
}> = ({ setDate, date, label }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        label={label}
        renderInput={(params) => <TextField {...params} />}
        value={date}
        onChange={(d) => {
          const date = stripTime(d);
          setDate(date);
        }}
      />
    </LocalizationProvider>
  );
};
