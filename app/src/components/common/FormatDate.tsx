import {
  differenceInHours,
  format,
  formatDistanceToNow,
  isToday,
} from "date-fns";
import React, { useEffect, useState } from "react";

const autoUpdateIntervalSeconds = 120;

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
  dateFormat?: DateFormat
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

export const FormatDate = (props: {
  value: Date | string | number;
  dateFormat?: DateFormat;
}) => {
  if (!props.value) {
    return null;
  }

  const [values, setValues] = useState<{ title: string; label: string }>(
    calculateValues()
  );

  useEffect(() => {
    if (differenceInHours(new Date(), getAsDate(props.value)) > 2) {
      return;
    }

    const i = setInterval(
      () => setValues(calculateValues()),
      autoUpdateIntervalSeconds * 1000
    );
    return () => clearInterval(i);
  }, [props.value, props.dateFormat]);

  return <span title={values.title}>{values.label}</span>;

  function calculateValues() {
    return {
      title: formatDate(
        props.value,
        props.dateFormat === DateFormat.relativeToNow || !props.dateFormat
          ? DateFormat.full
          : DateFormat.relativeToNow
      ),
      label: formatDate(props.value, props.dateFormat),
    };
  }
};
