import { IPropertyDefinition } from "../../common/IPropertyDefinition";
import { ISchedule } from "../../../serverApi/ISchedule";
import { IEntity } from "../../../serverApi/IEntity";
import { FormatDate } from "../../common/FormatDate";
import { DateFormat } from "../../common/dateTypes";
import { ReplayOutlined } from "@mui/icons-material";
import { addDays, isAfter, isSameDay } from "date-fns";

export function getScheduleForUser(entity: IEntity, userId: string): ISchedule {
  return entity.schedules?.[userId] ?? {};
}

export function getScheduleProperty(
  entity: IEntity,
  userId: string,
): IPropertyDefinition {
  const schedule = getScheduleForUser(entity, userId);
  return getSchedulePropertyFromSchedule(schedule);
}

export function getSchedulePropertyFromSchedule(
  schedule: ISchedule,
): IPropertyDefinition {
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
      const now = new Date();

      if (isAfter(now, schedule.nextOccurrence)) {
        return "red";
      }

      if (isSameDay(now, schedule.nextOccurrence)) {
        return "yellow";
      }

      if (isAfter(addDays(now, 2), schedule.nextOccurrence)) {
        return "green";
      }

      return "transparent";
    },
  };
}
