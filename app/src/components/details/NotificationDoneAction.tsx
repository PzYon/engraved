import { IJournal } from "../../serverApi/IJournal";
import { IEntry } from "../../serverApi/IEntry";
import { Button } from "@mui/material";
import { DialogFormButtonContainer } from "../common/FormButtonContainer";
import { useModifyScheduleMutation } from "../../serverApi/reactQuery/mutations/useModifyScheduleMutation";
import { useAppContext } from "../../AppContext";
import { ISchedule } from "../../serverApi/ISchedule";
import { parseDate } from "./edit/parseDate";
import { useNavigate } from "react-router-dom";
import { IScheduleDefinition } from "../../serverApi/IScheduleDefinition";
import React from "react";
import { ScheduledInfo } from "../overview/scheduled/ScheduledInfo";

export const NotificationDoneAction: React.FC<{
  journal: IJournal;
  entry?: IEntry;
}> = ({ journal, entry }) => {
  const { user } = useAppContext();

  const navigate = useNavigate();

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
      <Button variant={"outlined"} onClick={close}>
        Cancel
      </Button>
      {entry ? (
        <Button
          variant={isRecurring ? "outlined" : "contained"}
          onClick={() => {
            navigate(`../actions/delete/${entry.id}`);
          }}
        >
          Delete {entry ? "entry" : "journal"}
        </Button>
      ) : null}
      <Button
        variant={"contained"}
        onClick={() => {
          const scheduleDefinition: IScheduleDefinition = {
            nextOccurrence: schedule.recurrence
              ? parseDate(schedule.recurrence.dateString).date
              : null,
            recurrence: schedule.recurrence,
            onClickUrl: entry
              ? `${location.origin}/journals/${entry.parentId}/entries/${entry.id}/notification`
              : `${location.origin}/journals/${journal.id}/notification`,
          };

          modifyScheduleMutation.mutate(scheduleDefinition);

          close();
        }}
      >
        {getScheduleButtonLabel()}
      </Button>
    </DialogFormButtonContainer>
  );

  function close() {
    navigate("..");
  }

  function getScheduleButtonLabel() {
    return isRecurring ? (
      <>
        <ScheduledInfo schedule={schedule} />
        <span style={{ marginLeft: "8px" }}>
          (&quot;{schedule.recurrence.dateString}&quot;)
        </span>
      </>
    ) : (
      <>Mark {entry ? "entry" : "journal"} as done</>
    );
  }
};
