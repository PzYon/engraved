import React, { useState } from "react";
import { DialogFormButtonContainer } from "../../common/FormButtonContainer";
import { Button, FormControlLabel, Switch } from "@mui/material";
import { useModifyScheduleMutation } from "../../../serverApi/reactQuery/mutations/useModifyScheduleMutation";
import { ParseableDate } from "./ParseableDate";
import { DateSelector } from "../../common/DateSelector";
import { IScheduleDefinition } from "../../../serverApi/IScheduleDefinition";
import { IParsedDate } from "./parseDate";

export const EditSchedule: React.FC<{
  initialDate: string;
  journalId: string;
  entryId?: string;
  onCancel: () => void;
}> = ({ initialDate, journalId, entryId, onCancel }) => {
  const [parsed, setParsed] = useState<IParsedDate>({
    date: initialDate ? new Date(initialDate) : null,
  });

  const [showFullForm, setShowFullForm] = useState(!!parsed.date);

  const modifyScheduleMutation = useModifyScheduleMutation(journalId, entryId);

  return (
    <>
      <FormControlLabel
        label="Show full form"
        control={
          <Switch
            checked={showFullForm}
            onChange={(_, checked) => {
              setShowFullForm(checked);
            }}
          />
        }
      />
      <ParseableDate
        sx={{ marginBottom: 2 }}
        parseDateOnly={true}
        onChange={setParsed}
        onSelect={save}
      />

      {showFullForm ? (
        <DateSelector
          date={parsed.date}
          setDate={(d) => setParsed({ date: d })}
          showTime={true}
          showClear={true}
        />
      ) : null}

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
      nextOccurrence: parsed.date,
      recurrence: parsed.recurrence,
      onClickUrl: entryId
        ? `${location.origin}/journals/${journalId}/entries/${entryId}/notification`
        : `${location.origin}/journals/${journalId}/notification`,
    };

    modifyScheduleMutation.mutate(scheduleDefinition);

    onCancel();
  }
};
