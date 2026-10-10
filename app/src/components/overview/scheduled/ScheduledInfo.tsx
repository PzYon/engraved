import { FormatDate } from "../../common/FormatDate";
import { DateFormat } from "../../common/dateTypes";
import ReplayOutlined from "@mui/icons-material/ReplayOutlined";
import { ISchedule } from "../../../serverApi/ISchedule";
import React from "react";
import { Tooltip } from "@mui/material";

export const ScheduledInfo: React.FC<{
  schedule: ISchedule;
  noToggle?: boolean;
  showRecurrenceInfo?: boolean;
}> = ({ schedule, noToggle, showRecurrenceInfo }) => {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <FormatDate
        value={schedule.nextOccurrence}
        dateFormat={DateFormat.relativeToNow}
        noToggle={noToggle}
      />
      {schedule.recurrence?.dateString && showRecurrenceInfo ? (
        <span style={{ marginLeft: "8px" }}>
          (&quot;{schedule.recurrence.dateString}&quot;)
        </span>
      ) : null}
      {schedule.recurrence?.dateString ? (
        <Tooltip title={schedule.recurrence.dateString}>
          <span style={{ display: "flex" }}>
            <ReplayOutlined sx={{ ml: 1, fontSize: 14 }} />
          </span>
        </Tooltip>
      ) : null}
    </span>
  );
};
