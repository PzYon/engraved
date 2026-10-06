import React from "react";
import { Button, styled } from "@mui/material";
import { ISchedule } from "../../../serverApi/ISchedule";
import { IEntry } from "../../../serverApi/IEntry";
import { IJournal } from "../../../serverApi/IJournal";
import { IScheduleDefinition } from "../../../serverApi/IScheduleDefinition";
import { parseDate } from "./parseDate";
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
              <ScheduledInfo
                schedule={schedule!}
                showNextIfPassed={true}
                showRecurrenceInfo={true}
              />
            </>
          ) : (
            <>Mark {entry ? "entry" : "journal"} as done</>
          )}
        </Button>
      )}
    </MainButtons>
  );

  function removeSchedule() {
    modifyScheduleMutation.mutate({ nextOccurrence: null, onClickUrl: null });

    closeAction();
  }

  function completeSchedule() {
    const journalId = entry ? entry.parentId : journal?.id;
    const itemId = entry ? entry.id : journal?.id;

    modifyScheduleMutation.mutate({
      nextOccurrence: isRecurring
        ? (parseDate(schedule?.recurrence?.dateString ?? "").date ?? null)
        : null,
      recurrence: schedule?.recurrence,
      onClickUrl: `${location.origin}/journals/details/${journalId}/?${new URLSearchParams(getItemActionQueryParams("schedule", itemId)).toString()}`,
    });

    closeAction();
    overviewListContext.keepFocusAtIndex();
  }
};

const MainButtons = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: ${(p) => p.theme.spacing(2)};
`;
