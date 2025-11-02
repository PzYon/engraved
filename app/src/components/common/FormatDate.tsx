import { DateFormat, formatDate, getAsDate } from "./dateTypes";
import { differenceInHours } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";

const autoUpdateIntervalSeconds = 30;

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
      key={value?.toString()}
    />
  );
};

const FormatDateInternal: React.FC<{
  value: Date | string | number;
  dateFormat?: DateFormat;
  onClick?: () => void;
}> = ({ value, dateFormat, onClick }) => {
  const calculateValues = useCallback(() => {
    return {
      title: formatDate(
        value,
        dateFormat === DateFormat.relativeToNow || !dateFormat
          ? DateFormat.full
          : DateFormat.relativeToNow,
      ),
      label: formatDate(value, dateFormat),
    };
  }, [dateFormat, value]);

  const [values, setValues] = useState<{ title: string; label: string }>(
    calculateValues(),
  );

  useEffect(() => {
    if (differenceInHours(new Date(), getAsDate(value)) > 2) {
      return;
    }

    const interval = window.setInterval(
      () => setValues(calculateValues()),
      autoUpdateIntervalSeconds * 1000,
    );

    return () => window.clearInterval(interval);
  }, [dateFormat, value, calculateValues]);

  return (
    <span
      title={values.title}
      style={{ cursor: "pointer" }}
      onClick={(e) => {
        if (!onClick) {
          return;
        }

        e.stopPropagation();
        onClick();
      }}
    >
      {values.label}
    </span>
  );
};
