import { IJournal } from "../../serverApi/IJournal";
import { IEntry } from "../../serverApi/IEntry";
import { Button, Typography } from "@mui/material";
import { DialogFormButtonContainer } from "../common/FormButtonContainer";
import { useModifyScheduleMutation } from "../../serverApi/reactQuery/mutations/useModifyScheduleMutation";
import { useAppContext } from "../../AppContext";
import { ISchedule } from "../../serverApi/ISchedule";
import { parseDate } from "./edit/parseDate";
import { useNavigate } from "react-router-dom";
import { IScheduleDefinition } from "../../serverApi/IScheduleDefinition";
import React from "react";

export const NotificationDone: React.FC<{
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
    <>
      {isRecurring ? (
        <Typography>Will reoccur {schedule?.recurrence?.dateString}</Typography>
      ) : null}
      <DialogFormButtonContainer sx={!isRecurring ? { paddingTop: 0 } : {}}>
        <Button variant={"outlined"} onClick={close}>
          Cancel
        </Button>
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
          Mark {entry ? "entry" : "journal"} as done
        </Button>
        {entry ? (
          <Button
            variant={schedule?.recurrence ? "outlined" : "contained"}
            onClick={() => {
              navigate(`../delete`);
            }}
          >
            Delete {entry ? "entry" : "journal"}
          </Button>
        ) : null}
      </DialogFormButtonContainer>
    </>
  );

  function close() {
    navigate("..");
  }
};
