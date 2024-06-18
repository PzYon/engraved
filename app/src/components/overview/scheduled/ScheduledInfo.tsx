import { FormatDate } from "../../common/FormatDate";
import { DateFormat } from "../../common/dateTypes";
import { ReplayOutlined } from "@mui/icons-material";
import { ISchedule } from "../../../serverApi/ISchedule";
import React from "react";
import { parseDate } from "../../details/edit/parseDate";
import { isAfter } from "date-fns";

export const ScheduledInfo: React.FC<{
  schedule: ISchedule;
  showNextIfPassed?: boolean;
  showRecurrenceInfo?: boolean;
}> = ({ schedule, showNextIfPassed, showRecurrenceInfo }) => {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <FormatDate
        value={getDateValue()}
        dateFormat={DateFormat.relativeToNow}
      />
      {schedule.recurrence?.dateString && showRecurrenceInfo ? (
        <span style={{ marginLeft: "8px" }}>
          (&quot;{schedule.recurrence.dateString}&quot;)
        </span>
      ) : null}
      {schedule.recurrence?.dateString ? (
        <span
          title={schedule.recurrence.dateString}
          style={{ display: "flex" }}
        >
          <ReplayOutlined sx={{ ml: 1, fontSize: 14 }} />
        </span>
      ) : null}
    </span>
  );

  function getDateValue() {
    if (
      showNextIfPassed &&
      schedule.recurrence?.dateString &&
      schedule.nextOccurrence &&
      isAfter(new Date(), schedule.nextOccurrence)
    ) {
      return parseDate(schedule.recurrence.dateString).date.toString();
    }

    return schedule.nextOccurrence;
  }
};
