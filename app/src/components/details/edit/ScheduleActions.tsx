import React, { useEffect, useState } from "react";
import { Button, styled } from "@mui/material";
import { ISchedule } from "../../../serverApi/ISchedule";
import { IEntry } from "../../../serverApi/IEntry";
import { IJournal } from "../../../serverApi/IJournal";
import { IScheduleDefinition } from "../../../serverApi/IScheduleDefinition";
import { parseDateOnDemand } from "./parseDateOnDemand";
import {
  getItemActionQueryParams,
  useItemAction,
} from "../../common/actions/searchParamHooks";
import { ScheduledInfo } from "../../overview/scheduled/ScheduledInfo";
import { useOverviewListContext } from "../../overview/overviewList/OverviewListContext";
import { UseMutationResult } from "@tanstack/react-query";
import { ICommandResult } from "../../../serverApi/ICommandResult";

export const ScheduleActions: React.FC<{
  hasSchedule: boolean;
  isRecurring: boolean;
  isInPast: boolean;
  schedule?: ISchedule;
  entry?: IEntry;
  journal?: IJournal;
  modifyScheduleMutation: UseMutationResult<
    ICommandResult,
    Error,
    IScheduleDefinition,
    unknown
  >;
}> = ({
  hasSchedule,
  isRecurring,
  isInPast,
  schedule,
  entry,
  journal,
  modifyScheduleMutation,
}) => {
  const { closeAction } = useItemAction();
  const overviewListContext = useOverviewListContext();

  if (!hasSchedule) return null;

  const isUpcomingRecurrence = isRecurring && !isInPast;

  return (
    <MainButtons>
      {isUpcomingRecurrence ? (
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          onClick={removeSchedule}
        >
          Remove schedule
        </Button>
      ) : (
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          onClick={completeSchedule}
        >
          {isRecurring ? (
            <>
              Reschedule&nbsp;
              <NextOccurrence schedule={schedule} />
            </>
          ) : (
            <>Mark {entry ? "entry" : "journal"} as done</>
          )}
        </Button>
      )}
      {isRecurring && isInPast ? (
        <Button
          sx={{ width: "100%" }}
          variant="outlined"
          onClick={removeSchedule}
        >
          Clear schedule
        </Button>
      ) : null}
    </MainButtons>
  );

  function removeSchedule() {
    modifyScheduleMutation.mutate({ nextOccurrence: null, onClickUrl: null });

    closeAction();
  }

  async function completeSchedule() {
    const journalId = entry ? entry.parentId : journal?.id;
    const itemId = entry ? entry.id : journal?.id;

    modifyScheduleMutation.mutate({
      nextOccurrence: isRecurring
        ? ((await parseDateOnDemand(schedule?.recurrence?.dateString ?? ""))
            .date ?? null)
        : null,
      recurrence: schedule?.recurrence,
      onClickUrl: `${location.origin}/journals/details/${journalId}/?${new URLSearchParams(getItemActionQueryParams("schedule", itemId)).toString()}`,
    });

    closeAction();
    overviewListContext.keepFocusAtIndex();
  }
};

// Shows when a recurring schedule comes up next. That is what its recurrence
// ("every sat 15:00") says and not the date it has stored, which has passed
// once the schedule is due. The date is not there right away, as the parser
// for it is only loaded now.
const NextOccurrence: React.FC<{ schedule: ISchedule | undefined }> = ({
  schedule,
}) => {
  const [nextOccurrence, setNextOccurrence] = useState<string>();

  const recurrence = schedule?.recurrence?.dateString;
  const storedOccurrence = schedule?.nextOccurrence;

  useEffect(() => {
    if (!recurrence) {
      return;
    }

    let isObsolete = false;

    parseDateOnDemand(recurrence).then((parsed) => {
      if (!isObsolete) {
        setNextOccurrence(parsed.date?.toString() ?? storedOccurrence);
      }
    });

    return () => {
      isObsolete = true;
    };
  }, [recurrence, storedOccurrence]);

  return (
    <ScheduledInfo
      schedule={{ ...schedule, nextOccurrence }}
      noToggle={true}
      showRecurrenceInfo={true}
    />
  );
};

const MainButtons = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: ${(p) => p.theme.spacing(2)};
`;
