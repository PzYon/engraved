import React, { useState } from "react";
import { DateSelector } from "../../common/DateSelector";
import { DialogFormButtonContainer } from "../../common/FormButtonContainer";
import { Button } from "@mui/material";
import {
  IScheduleDefinition,
  useModifyScheduleMutation,
} from "../../../serverApi/reactQuery/mutations/useModifyScheduleMutation";
import { FunkyDate } from "./FunkyDate";

export const EditSchedule: React.FC<{
  initialDate: string;
  journalId: string;
  entryId?: string;
  onCancel: () => void;
  onScheduleSelected: (schedule: IScheduleDefinition) => void;
}> = ({ initialDate, journalId, entryId, onCancel, onScheduleSelected }) => {
  const [date, setDate] = useState<Date>(
    initialDate ? new Date(initialDate) : null,
  );

  const modifyScheduleMutation = useModifyScheduleMutation(journalId, entryId);

  return (
    <>
      <FunkyDate
        sx={{ marginBottom: 2 }}
        onSelect={(d) => {
          setDate(d);
        }}
      />
      <DateSelector
        date={date}
        setDate={setDate}
        showTime={true}
        showClear={true}
      />
      <DialogFormButtonContainer>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            const scheduleDefinition: IScheduleDefinition = {
              date: date,
              onClickUrl: location.origin + "/journals/" + journalId,
            };

            if (!entryId) {
              onScheduleSelected({});
            } else {
              modifyScheduleMutation.mutate(scheduleDefinition);
            }

            onCancel();
          }}
        >
          Save
        </Button>
      </DialogFormButtonContainer>
    </>
  );
};
