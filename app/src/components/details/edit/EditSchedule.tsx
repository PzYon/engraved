import React, { useEffect, useState } from "react";
import { DialogFormButtonContainer } from "../../common/FormButtonContainer";
import { Button, FormControlLabel, Switch } from "@mui/material";
import { useModifyScheduleMutation } from "../../../serverApi/reactQuery/mutations/useModifyScheduleMutation";
import { ParseableDate } from "./ParseableDate";
import { DateSelector } from "../../common/DateSelector";
import { IScheduleDefinition } from "../../../serverApi/IScheduleDefinition";
import { IParsedDate } from "./parseDate";
import { IEntity } from "../../../serverApi/IEntity";
import { getScheduleForUser } from "../../overview/scheduled/scheduleUtils";
import { IJournal } from "../../../serverApi/IJournal";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useAppContext } from "../../../AppContext";

export const EditSchedule: React.FC<{
  journalId: string;
  journal: IJournal;
  entryId?: string;
  onCancel: () => void;
}> = ({ journalId, journal, entryId, onCancel }) => {
  const [parsed, setParsed] = useState<IParsedDate>({});

  useEffect(() => {
    getNextOccurrence().then((d) => {
      setParsed({
        date: d ? new Date(d) : null,
      });
    });
  }, [journal, entryId, journalId]);

  const { user } = useAppContext();

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

  async function getNextOccurrence() {
    const entity: IEntity = await (entryId
      ? ServerApi.getEntry(entryId)
      : Promise.resolve(journal));

    if (!entity) {
      return null;
    }

    return getScheduleForUser(entity, user.id).nextOccurrence;
  }

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
