import React from "react";
import { IEntry } from "../../serverApi/IEntry";
import { differenceInDays } from "date-fns";
import { Typography } from "@mui/material";
import HistoryToggleOff from "@mui/icons-material/HistoryToggleOff";

export const DateDiff: React.FC<{ label: string; hideBorder?: boolean }> = ({
  label,
  hideBorder,
}) => {
  return (
    <Typography
      sx={{
        pt: 1,
        pb: 1,
        pl: 1,
        ml: 3,
        fontSize: "smaller",
        display: "flex",
        alignItems: "center",
        borderLeft: hideBorder ? 0 : "3px solid white",
        color: "primary.main",
      }}
    >
      <HistoryToggleOff fontSize="small" sx={{ mr: 1 }} />
      {label}
    </Typography>
  );
};

export const DifferenceInDays: React.FC<{
  item: IEntry;
  lastItem: IEntry;
}> = ({ item, lastItem }) => {
  if (!item?.dateTime || !lastItem.dateTime) {
    return null;
  }

  const diff = differenceInDays(lastItem.dateTime, item.dateTime);

  return (
    <DateDiff hideBorder={true} label={diff === 1 ? "1 day" : `${diff} days`} />
  );
};
