import { IPropertyDefinition } from "../../common/IPropertyDefinition";
import { ISchedule } from "../../../serverApi/ISchedule";
import { IEntity } from "../../../serverApi/IEntity";
import { FormatDate } from "../../common/FormatDate";
import { DateFormat, formatDate } from "../../common/dateTypes";
import { ReplayOutlined } from "@mui/icons-material";
import { addDays, isAfter, isSameDay } from "date-fns";
import { Tooltip } from "@mui/material";

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
      <Tooltip title={formatDate(schedule?.nextOccurrence, DateFormat.full)}>
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
      </Tooltip>
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
