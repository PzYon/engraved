import React from "react";
import { DateFormat, FormatDate } from "../../common/FormatDate";
import { Typography } from "@mui/material";

export const EntriesDateTableCell: React.FC<{ date: Date | string }> = ({
  date,
}) => {
  return (
    <>
      <FormatDate value={date} dateFormat={DateFormat.dateOnly} />
      <br />
      <Typography sx={{ opacity: 0.5 }} fontSize="small">
        <FormatDate value={date} dateFormat={DateFormat.relativeToNowDayPlus} />
      </Typography>
    </>
  );
};
