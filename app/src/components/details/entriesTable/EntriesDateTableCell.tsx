import React from "react";
import { DateFormat } from "../../common/dateTypes";
import { Typography } from "@mui/material";
import { FormatDate } from "../../common/FormatDate";

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
