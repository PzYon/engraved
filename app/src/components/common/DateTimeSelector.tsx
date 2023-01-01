import React, { useState } from "react";
import { DateSelector } from "./DateSelector";
import { TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import de from "date-fns/locale/de";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";

export const DateTimeSelector: React.FC<{
  initialDate: Date;
  label: string;
}> = ({ initialDate, label }) => {
  const [date, setDate] = useState<Date>(initialDate);

  return (
    <>
      <DateSelector setDate={setDate} date={date} label={label} />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
        <TimePicker
          ampm={false}
          inputFormat="HH:mm:ss"
          mask="__:__:__"
          views={["hours", "minutes", "seconds"]}
          value={date}
          onChange={setDate}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </>
  );
};
