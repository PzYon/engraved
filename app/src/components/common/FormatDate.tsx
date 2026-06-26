import { DateFormat, formatDate, getAsDate } from "./dateTypes";
import { differenceInHours } from "date-fns";
import React, { useState } from "react";
import { Tooltip } from "@mui/material";
import { useNow } from "./useNow";

export const FormatDate: React.FC<{
  value: Date | string | number | null | undefined;
  dateFormat?: DateFormat;
  fallbackValue?: React.ReactNode;
  noToggle?: boolean;
}> = ({ value, dateFormat, fallbackValue, noToggle }) => {
  const [isToggled, setIsToggled] = useState(false);

  if (!value) {
    return <>{fallbackValue}</>;
  }

  return (
    <FormatDateInternal
      onClick={noToggle ? undefined : () => setIsToggled(!isToggled)}
      value={value}
      dateFormat={isToggled ? DateFormat.fullCompact : dateFormat}
      key={value?.toString() + "-" + isToggled}
    />
  );
};

const FormatDateInternal: React.FC<{
  value: Date | string | number;
  dateFormat?: DateFormat;
  onClick?: () => void;
}> = ({ value, dateFormat, onClick }) => {
  // Relative labels only need to keep updating while the value is recent. Older
  // values don't visibly change, so they don't subscribe to the shared ticker.
  const isRecent = differenceInHours(new Date(), getAsDate(value)) <= 2;

  // Re-render on every shared tick (while recent) to refresh the relative label.
  useNow(isRecent);

  const title = formatDate(
    value,
    dateFormat === DateFormat.relativeToNow || !dateFormat
      ? DateFormat.full
      : DateFormat.relativeToNow,
  );
  const label = formatDate(value, dateFormat);

  return (
    <Tooltip title={title}>
      <span
        style={{ cursor: "pointer" }}
        onClick={(e) => {
          if (!onClick) {
            return;
          }

          e.stopPropagation();
          onClick();
        }}
      >
        {label}
      </span>
    </Tooltip>
  );
};
