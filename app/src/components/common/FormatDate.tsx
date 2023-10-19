import {
  differenceInHours,
  format,
  formatDistanceToNow,
  isToday,
} from "date-fns";
import React, { useCallback, useEffect, useState } from "react";

const autoUpdateIntervalSeconds = 30;

export enum DateFormat {
  relativeToNow,
  relativeToNowDayPlus,
  numerical,
  dateOnly,
  full,
  ticks,
  timeOnly,
}

function getAsDate(value: string | number | Date): Date {
  if (typeof value === "string" || typeof value === "number") {
    return new Date(value);
  }

  if (value instanceof Date) {
    return value;
  }

  throw new Error(`'${value}' is an invalid date.`);
}

export const formatDate = (
  value: string | number | Date,
  dateFormat?: DateFormat,
): string => {
  const date = getAsDate(value);

  switch (dateFormat) {
    case DateFormat.dateOnly:
      return format(date, "PPPP");
    case DateFormat.full:
      return format(date, "PPPPpppp");
    case DateFormat.numerical:
      return format(date, "Pp");
    case DateFormat.ticks:
      return format(date, "T");
    case DateFormat.timeOnly:
      return format(date, "HH:mm:ss");
    case DateFormat.relativeToNowDayPlus:
      return isToday(date)
        ? "today"
        : formatDistanceToNow(date, {
            addSuffix: true,
            includeSeconds: true,
          });
    case DateFormat.relativeToNow:
    default:
      return formatDistanceToNow(date, {
        addSuffix: true,
        includeSeconds: true,
      });
  }
};

export const FormatDate: React.FC<{
  value: Date | string | number;
  dateFormat?: DateFormat;
  fallbackValue?: React.ReactNode;
}> = ({ value, dateFormat, fallbackValue }) => {
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
  }, [value, dateFormat]);

  const [values, setValues] = useState<{ title: string; label: string }>(
    calculateValues(),
  );

  useEffect(() => {
    setValues(calculateValues());

    if (differenceInHours(new Date(), getAsDate(value)) > 2) {
      return;
    }

    const interval = setInterval(
      () => setValues(calculateValues()),
      autoUpdateIntervalSeconds * 1000,
    );
    return () => clearInterval(interval);
  }, [value, dateFormat, calculateValues]);

  if (!value) {
    return <>{fallbackValue}</>;
  }

  return <span title={values.title}>{values.label}</span>;
};
