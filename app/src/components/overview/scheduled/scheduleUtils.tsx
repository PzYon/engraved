import { IPropertyDefinition } from "../../common/IPropertyDefinition";
import { ISchedule } from "../../../serverApi/ISchedule";
import { IEntity } from "../../../serverApi/IEntity";
import { addDays, compareAsc, isAfter, isSameDay } from "date-fns";
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

      if (schedule.nextOccurrence && isAfter(now, schedule.nextOccurrence)) {
        return "red";
      }

      if (schedule.nextOccurrence && isSameDay(now, schedule.nextOccurrence)) {
        return "yellow";
      }

      if (
        schedule.nextOccurrence &&
        isAfter(addDays(now, 2), schedule.nextOccurrence)
      ) {
        return "green";
      }

      return "transparent";
    },
  };
}

export function getScheduleDefinition(
  parsedDate: IParsedDate,
  journalId: string | undefined,
  entryId: string,
): IScheduleDefinition {
  return parsedDate?.date
    ? {
        nextOccurrence: parsedDate.date,
        recurrence: parsedDate.recurrence,
        // {0} will be replaced on server with actual entry ID
        onClickUrl: `${location.origin}/journals/details/${journalId}/?${new URLSearchParams(getItemActionQueryParams("schedule", entryId)).toString()}`,
      }
    : { nextOccurrence: null, onClickUrl: null };
}

// Resolves the schedule definition to persist when saving an entry.
//
// A save may only set or change a schedule, never remove one. The schedule is
// derived from a date typed into the title: when a new date is present it is
// applied; otherwise (auto-save, body/list edits, or a title edit without a
// date) any existing schedule is kept untouched. Removing a schedule is done
// exclusively through the dedicated "edit schedule" action.
export function getScheduleDefinitionForUpsert(
  parsedDate: IParsedDate | undefined,
  existingSchedule: ISchedule | undefined,
  journalId: string | undefined,
  entryId: string,
): IScheduleDefinition {
  if (parsedDate?.date) {
    return getScheduleDefinition(parsedDate, journalId, entryId);
  }

  if (existingSchedule?.nextOccurrence) {
    return getScheduleDefinition(
      {
        input: "",
        date: new Date(existingSchedule.nextOccurrence),
        recurrence: existingSchedule.recurrence,
      },
      journalId,
      entryId,
    );
  }

  return { nextOccurrence: null, onClickUrl: null };
}

export function sortEntitiesByDates(
  entities: IEntity[],
  userId: string,
): IEntity[] {
  return [...entities].sort((a: IEntity, b: IEntity) => {
    const nextOccurrenceA = getScheduleForUser(a, userId).nextOccurrence;
    const nextOccurrenceB = getScheduleForUser(b, userId).nextOccurrence;

    if (nextOccurrenceA && nextOccurrenceB) {
      return compareAsc(new Date(nextOccurrenceA), new Date(nextOccurrenceB));
    }

    if (nextOccurrenceA) {
      return -1;
    }

    if (nextOccurrenceB) {
      return 1;
    }

    return 0;
  });
}
