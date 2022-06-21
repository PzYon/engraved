import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField } from "@mui/material";
import React from "react";

export const DateTimeSelector: React.FC<{
  setDate: (date: Date) => void;
  date: Date;
}> = ({ setDate, date }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        renderInput={(params) => <TextField {...params} />}
        value={date}
        onChange={setDate}
      />
    </LocalizationProvider>
  );
};
