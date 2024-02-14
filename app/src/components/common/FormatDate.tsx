import { DateFormat, dateTypes, getAsDate } from "./dateTypes";
import { differenceInHours } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";

const autoUpdateIntervalSeconds = 30;

export const FormatDate: React.FC<{
  value: Date | string | number | null | undefined;
  dateFormat?: DateFormat;
  fallbackValue?: React.ReactNode;
}> = ({ value, dateFormat, fallbackValue }) => {
  return !value ? (
    <>{fallbackValue}</>
  ) : (
    <FormatDateInternal value={value} dateFormat={dateFormat} />
  );
};

const FormatDateInternal: React.FC<{
  value: Date | string | number;
  dateFormat?: DateFormat;
}> = ({ value, dateFormat }) => {
  const calculateValues = useCallback(() => {
    return {
      title: dateTypes(
        value,
        dateFormat === DateFormat.relativeToNow || !dateFormat
          ? DateFormat.full
          : DateFormat.relativeToNow,
      ),
      label: dateTypes(value, dateFormat),
    };
  }, [dateFormat, value]);

  const [values, setValues] = useState<{ title: string; label: string }>(
    calculateValues(),
  );

  useEffect(() => {
    setValues(calculateValues());

    if (differenceInHours(new Date(), getAsDate(value)) > 2) {
      return;
    }

    const interval = window.setInterval(
      () => setValues(calculateValues()),
      autoUpdateIntervalSeconds * 1000,
    );
    return () => window.clearInterval(interval);
  }, [value, dateFormat, calculateValues]);

  return <span title={values.title}>{values.label}</span>;
};
