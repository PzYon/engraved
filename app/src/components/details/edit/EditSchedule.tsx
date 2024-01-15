import React, { useState } from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { DateSelector } from "../../common/DateSelector";
import { DialogFormButtonContainer } from "../../common/FormButtonContainer";
import { Button } from "@mui/material";
import { useModifyScheduleMutation } from "../../../serverApi/reactQuery/mutations/useModifyScheduleMutation";

// todo: make this more reusable

export const EditSchedule: React.FC<{
  journal: IJournal;
  entryId?: string;
  onCancel: () => void;
}> = ({ journal, entryId, onCancel }) => {
  const [date, setDate] = useState<Date>(
    journal.schedule?.nextOccurrence
      ? new Date(journal.schedule.nextOccurrence)
      : null,
  );

  const modifyScheduleMutation = useModifyScheduleMutation(journal.id, entryId);

  return (
    <>
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
            modifyScheduleMutation.mutate({ date: date });
            onCancel();
          }}
        >
          Save
        </Button>
      </DialogFormButtonContainer>
    </>
  );
};
