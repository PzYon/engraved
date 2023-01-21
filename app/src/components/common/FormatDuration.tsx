import React, { useEffect, useState } from "react";
import { getDurationAsHhMmSs } from "../../util/getDurationAsHhMmSs";

const autoUpdateDurationIntervalSeconds = 30;

export const FormatDuration: React.FC<{
  start: Date | string;
  end: Date | string;
}> = ({ start, end }) => {
  const [duration, setDuration] = useState(getDuration());

  useEffect(() => {
    if (end) {
      return;
    }

    const i = setInterval(
      () => setDuration(getDuration()),
      autoUpdateDurationIntervalSeconds * 1000
    );
    return () => clearInterval(i);
  }, [start, end]);

  return <span>{duration}</span>;

  function getDuration() {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();

    return getDurationAsHhMmSs(startDate, endDate);
  }
};
