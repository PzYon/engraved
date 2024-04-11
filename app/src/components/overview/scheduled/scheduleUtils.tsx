import { IPropertyDefinition } from "../../common/IPropertyDefinition";
import { DateFormat } from "../../common/dateTypes";
import { isBefore, isSameDay } from "date-fns";
import { FormatDate } from "../../common/FormatDate";
import { ISchedule } from "../../../serverApi/ISchedule";
import { ReplayOutlined } from "@mui/icons-material";

export function getScheduleProperty(schedule?: ISchedule): IPropertyDefinition {
  return {
    key: "schedule",
    node: () => (
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
    ),
    label: "Scheduled",
    hideWhen: () => !schedule?.nextOccurrence,
    highlightStyle: () => {
      if (!isBefore(new Date(), schedule.nextOccurrence)) {
        return "red";
      }

      if (isSameDay(new Date(), schedule.nextOccurrence)) {
        return "yellow";
      }

      return "green";
    },
  };
}
