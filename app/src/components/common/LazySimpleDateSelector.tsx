import { stripTime } from "../../util/utils";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { de } from "date-fns/locale/de";
import { ISimpleDateSelectorProps } from "./ISimpleDateSelectorProps";
import { DateAdjustmentButtons } from "./DateAdjustmentButtons";

const LazySimpleDateSelector: React.FC<ISimpleDateSelectorProps> = ({
  hasFocus,
  setDate,
  date,
  label,
  shouldDisableDate,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
      <DesktopDatePicker
        sx={{ width: "100%" }}
        autoFocus={hasFocus}
        label={label}
        format="EEE dd.MM.yyyy"
        value={date || null}
        showDaysOutsideCurrentMonth={true}
        shouldDisableDate={shouldDisableDate}
        onChange={(d) => {
          setDate(stripTime(d));
        }}
      />
      <DateAdjustmentButtons date={date} setDate={setDate} />
    </LocalizationProvider>
  );
};

export default LazySimpleDateSelector;
