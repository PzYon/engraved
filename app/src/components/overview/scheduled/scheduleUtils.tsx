import { IPropertyDefinition } from "../../common/IPropertyDefinition";
import { ISchedule } from "../../../serverApi/ISchedule";
import { IEntity } from "../../../serverApi/IEntity";
import { addDays, isAfter, isSameDay } from "date-fns";
import { IParsedDate } from "../../details/edit/parseDate";
import { IScheduleDefinition } from "../../../serverApi/IScheduleDefinition";
import { ScheduledInfo } from "./ScheduledInfo";
import { getItemActionQueryParams } from "../../common/actions/searchParamHooks";

export function getScheduleForUser(entity: IEntity, userId: string): ISchedule {
  return entity?.schedules?.[userId] ?? {};
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
    node: () => <ScheduledInfo schedule={schedule} />,
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

export function getScheduleDefinition(
  parsedDate: IParsedDate,
  journalId: string,
  entryId: string,
): IScheduleDefinition {
  return parsedDate?.date
    ? {
        nextOccurrence: parsedDate.date,
        recurrence: parsedDate.recurrence,
        // {0} will be replaced on server with actual entry ID
        onClickUrl: `${location.origin}/journals/details/${journalId}/?${new URLSearchParams(getItemActionQueryParams("notification-done", entryId)).toString()}`,
      }
    : undefined;
}
