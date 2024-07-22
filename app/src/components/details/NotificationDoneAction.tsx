import { IJournal } from "../../serverApi/IJournal";
import { IEntry } from "../../serverApi/IEntry";
import { Button } from "@mui/material";
import { DialogFormButtonContainer } from "../common/FormButtonContainer";
import { useModifyScheduleMutation } from "../../serverApi/reactQuery/mutations/useModifyScheduleMutation";
import { useAppContext } from "../../AppContext";
import { ISchedule } from "../../serverApi/ISchedule";
import { parseDate } from "./edit/parseDate";
import { IScheduleDefinition } from "../../serverApi/IScheduleDefinition";
import React from "react";
import { ScheduledInfo } from "../overview/scheduled/ScheduledInfo";
import { isAfter } from "date-fns";
import { useItemAction } from "../common/actions/itemActionHook";

export const NotificationDoneAction: React.FC<{
  journal: IJournal;
  entry?: IEntry;
}> = ({ journal, entry }) => {
  const { user } = useAppContext();

  const { closeAction, openAction } = useItemAction();

  const modifyScheduleMutation = useModifyScheduleMutation(
    journal?.id ?? entry?.parentId,
    entry?.id,
  );

  const schedule: ISchedule = (entry ? entry.schedules : journal.schedules)?.[
    user.id
  ];

  const isRecurring = !!schedule?.recurrence?.dateString;

  return (
    <DialogFormButtonContainer sx={{ paddingTop: 0 }}>
      <Button variant={"outlined"} onClick={closeAction}>
        Cancel
      </Button>
      {entry ? (
        <Button
          variant={isRecurring ? "outlined" : "contained"}
          onClick={() => openAction(entry.id, "delete")}
        >
          Delete {entry ? "entry" : "journal"}
        </Button>
      ) : null}
      {isAfter(new Date(), schedule.nextOccurrence) ||
      !schedule.recurrence?.dateString ? (
        <Button
          variant={"contained"}
          onClick={() => {
            const scheduleDefinition: IScheduleDefinition = {
              nextOccurrence: schedule.recurrence
                ? parseDate(schedule.recurrence.dateString).date
                : null,
              recurrence: schedule.recurrence,
              onClickUrl: entry
                ? `${location.origin}/journals/details/${entry.parentId}/entries/${entry.id}/notification`
                : `${location.origin}/journals/details/${journal.id}/notification`,
            };

            modifyScheduleMutation.mutate(scheduleDefinition);

            closeAction();
          }}
        >
          {getScheduleButtonLabel()}
        </Button>
      ) : null}
    </DialogFormButtonContainer>
  );

  function getScheduleButtonLabel() {
    return isRecurring ? (
      <>
        Reschedule&nbsp;
        <ScheduledInfo
          schedule={schedule}
          showNextIfPassed={true}
          showRecurrenceInfo={true}
        />
      </>
    ) : (
      <>Mark {entry ? "entry" : "journal"} as done</>
    );
  }
};
