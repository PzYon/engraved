import React from "react";
import { getDurationAsHhMmSs } from "../../util/getDurationAsHhMmSs";

export const FormatDuration: React.FC<{
  start: Date | string;
  end: Date | string;
}> = ({ start, end }) => {
  return <span>{getDuration()}</span>;

  function getDuration() {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();

    return getDurationAsHhMmSs(startDate, endDate);
  }
};
