import { FormatDate } from "../../common/FormatDate";
import { DateFormat } from "../../common/dateTypes";
import { ReplayOutlined } from "@mui/icons-material";
import { ISchedule } from "../../../serverApi/ISchedule";
import React from "react";

export const ScheduledInfo: React.FC<{ schedule: ISchedule }> = ({
  schedule,
}) => {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <FormatDate
        value={schedule?.nextOccurrence}
        dateFormat={DateFormat.relativeToNow}
      />
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
};
