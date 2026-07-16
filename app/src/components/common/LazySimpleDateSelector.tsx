import { stripTime } from "../../util/utils";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { de } from "date-fns/locale/de";
import { Button } from "@mui/material";
import { addDays } from "date-fns";
import { styled } from "@mui/system";
import { ISimpleDateSelectorProps } from "./ISimpleDateSelectorProps";

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
      <ButtonContainer>
        <Button
          variant="text"
          sx={{ fontSize: "small" }}
          onClick={() => setDate(addDays(date ?? new Date(), -1))}
        >
          -1day
        </Button>
        <Button
          variant="text"
          sx={{ fontSize: "small" }}
          onClick={() => setDate(addDays(date ?? new Date(), 1))}
        >
          +1day
        </Button>
      </ButtonContainer>
    </LocalizationProvider>
  );
};

const ButtonContainer = styled("div")`
  display: flex;
  justify-content: end;
`;

export default LazySimpleDateSelector;
