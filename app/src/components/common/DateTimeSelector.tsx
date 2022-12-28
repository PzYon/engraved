import React, { useState } from "react";
import { DateSelector } from "./DateSelector";
import { TextField } from "@mui/material";

export const DateTimeSelector: React.FC<{
  initialDate: Date;
  label: string;
}> = ({ initialDate, label }) => {
  const [date, setDate] = useState<Date>(initialDate);

  const [time, setTime] = useState<string>(() => {
    const segments = initialDate.toTimeString().split(":");
    return segments[0] + ":" + segments[1];
  });

  return (
    <>
      <DateSelector setDate={setDate} date={date} label={label} />
      <TextField
        defaultValue={time}
        onChange={(event) => setTime(event.target.value)}
      />
    </>
  );
};
