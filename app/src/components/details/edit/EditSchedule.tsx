import React, { useState } from "react";
import { DialogFormButtonContainer } from "../../common/FormButtonContainer";
import { Button } from "@mui/material";
import {
  IScheduleDefinition,
  useModifyScheduleMutation,
} from "../../../serverApi/reactQuery/mutations/useModifyScheduleMutation";
import { ParseableDate } from "./ParseableDate";
import { DateSelector } from "../../common/DateSelector";

export const EditSchedule: React.FC<{
  initialDate: string;
  journalId: string;
  entryId?: string;
  onCancel: () => void;
}> = ({ initialDate, journalId, entryId, onCancel }) => {
  const [date, setDate] = useState<Date>(
    initialDate ? new Date(initialDate) : null,
  );

  const modifyScheduleMutation = useModifyScheduleMutation(journalId, entryId);

  return (
    <>
      <ParseableDate
        sx={{ marginBottom: 2 }}
        onChange={(d) => {
          if (d.date) {
            setDate(d.date);
          }
        }}
        onSelect={save}
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
        <Button variant="contained" onClick={save}>
          Save
        </Button>
      </DialogFormButtonContainer>
    </>
  );

  function save() {
    const scheduleDefinition: IScheduleDefinition = {
      date: date,
      onClickUrl: location.origin + "/journals/" + journalId,
    };

    modifyScheduleMutation.mutate(scheduleDefinition);

    onCancel();
  }
};
