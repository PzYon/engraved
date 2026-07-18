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
  isInFuture: boolean;
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
  isInFuture,
  schedule,
  entry,
  journal,
  modifyScheduleMutation,
}) => {
  const { closeAction } = useItemAction();
  const overviewListContext = useOverviewListContext();

  if (!hasSchedule) return null;

  return (
    <MainButtons>
      {isInPast || !isRecurring ? (
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          onClick={() => {
            const scheduleDefinition: IScheduleDefinition = {
              nextOccurrence: isRecurring
                ? (parseDate(schedule?.recurrence?.dateString ?? "").date ??
                  null)
                : null,
              recurrence: schedule?.recurrence,
              onClickUrl: entry
                ? `${location.origin}/journals/details/${entry.parentId}/?${new URLSearchParams(getItemActionQueryParams("schedule", entry.id)).toString()}`
                : `${location.origin}/journals/details/${journal?.id}/?${new URLSearchParams(getItemActionQueryParams("schedule", journal?.id)).toString()}`,
            };

            modifyScheduleMutation.mutate(scheduleDefinition);

            closeAction();
            overviewListContext.keepFocusAtIndex();
          }}
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
      ) : null}

      {(isInFuture || isRecurring) && !(isInPast || !isRecurring) ? (
        <Button
          sx={{ width: "100%" }}
          variant="contained"
          onClick={() => {
            const scheduleDefinition: IScheduleDefinition = {
              nextOccurrence: null,
              onClickUrl: null,
            };

            modifyScheduleMutation.mutate(scheduleDefinition);

            closeAction();
          }}
        >
          {!isInFuture ? (
            <>Mark {entry ? "entry" : "journal"} as done</>
          ) : (
            "Remove schedule"
          )}
        </Button>
      ) : null}
    </MainButtons>
  );
};

const MainButtons = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: ${(p) => p.theme.spacing(2)};

  &:empty {
    display: none;
  }
`;
