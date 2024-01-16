import React, { useState } from "react";
import { DateSelector } from "../../common/DateSelector";
import { DialogFormButtonContainer } from "../../common/FormButtonContainer";
import { Button } from "@mui/material";
import { useModifyScheduleMutation } from "../../../serverApi/reactQuery/mutations/useModifyScheduleMutation";

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
