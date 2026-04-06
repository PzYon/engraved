import { stripTime } from "../../util/utils";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React from "react";
import { ISimpleDateSelectorProps } from "./DateSelector";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { de } from "date-fns/locale/de";

const LazySimpleDateSelector: React.FC<ISimpleDateSelectorProps> = ({
  hasFocus,
  setDate,
  date,
  label,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
      <DesktopDatePicker
        sx={{ width: "100%" }}
        autoFocus={hasFocus}
        label={label}
        value={date || null}
        showDaysOutsideCurrentMonth={true}
        onChange={(d) => {
          setDate(stripTime(d));
        }}
      />
    </LocalizationProvider>
  );
};

export default LazySimpleDateSelector;
