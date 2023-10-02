import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { translations } from "../../../i18n/translations";
import { IJournal } from "../../../serverApi/IJournal";
import { JournalAttributesSelector } from "./JournalAttributesSelector";
import { JournalType } from "../../../serverApi/JournalType";
import { IUpsertEntryCommand } from "../../../serverApi/commands/IUpsertEntryCommand";
import { IUpsertGaugeEntryCommand } from "../../../serverApi/commands/IUpsertGaugeEntryCommand";
import { IJournalAttributeValues } from "../../../serverApi/IJournalAttributeValues";
import { DateSelector } from "../../common/DateSelector";
import { FormElementContainer } from "../../common/FormUtils";
import { IEntry } from "../../../serverApi/IEntry";
import { ITimerEntry } from "../../../serverApi/ITimerEntry";
import { stripTime } from "../../../util/utils";
import { AttributeComboSearch } from "./AttributeComboSearch";
import { hasAttributes } from "../../../util/entryUtils";
import { UpsertTimerEntry } from "./UpsertTimerEntry";
import { IUpsertTimerEntryCommand } from "../../../serverApi/commands/IUpsertTimerEntryCommand";
import { LastSelectedDateStorage } from "./LastSelectedDateStorage";
import { useEditJournalMutation } from "../../../serverApi/reactQuery/mutations/useEditJournalMutation";
import { useUpsertEntryMutation } from "../../../serverApi/reactQuery/mutations/useUpsertEntryMutation";
import { DialogFormButtonContainer } from "../../common/FormButtonContainer";
import { IGaugeEntry } from "../../../serverApi/IGaugeEntry";

const storage = new LastSelectedDateStorage();

export const UpsertEntry: React.FC<{
  journal: IJournal;
  entry?: IEntry;
  onSaved?: () => void;
  onCancel?: () => void;
}> = ({ journal, entry, onSaved, onCancel }) => {
  const [attributeValues, setAttributeValues] =
    useState<IJournalAttributeValues>(entry?.journalAttributeValues || {}); // empty means nothing selected in the selector

  const [notes, setNotes] = useState<string>(entry?.notes || "");

  const [forceResetSelectors, setForceResetSelectors] = useState("initial");

  const [value, setValue] = useState<string>(
    (entry as IGaugeEntry)?.value?.toString() || "",
  );

  const [date, setDate] = useState<Date>(
    entry?.dateTime
      ? new Date(entry.dateTime)
      : stripTime(storage.getLastSelectedDate()),
  );

  const [startDate, setStartDate] = useState((entry as ITimerEntry)?.startDate);

  const [endDate, setEndDate] = useState((entry as ITimerEntry)?.endDate);

  const [showFullTimerForm, setShowFullTimerForm] = useState(false);

  const editJournalMutation = useEditJournalMutation(journal.id);

  const upsertEntryMutation = useUpsertEntryMutation(
    journal.id,
    journal.type,
    entry?.id,
    onSaved,
  );

  return (
    <FormControl>
      {journal.type !== JournalType.Timer ? (
        <FormElementContainer>
          <DateSelector
            setDate={(d) => {
              setDate(d);
              storage.setLastSelectedDate(d);
            }}
            date={date}
          />
        </FormElementContainer>
      ) : null}

      {journal.type === JournalType.Timer && !entry ? (
        <FormControlLabel
          label="Show full form"
          control={
            <Switch
              onChange={(_, checked) => {
                if (checked) {
                  setStartDate(new Date().toString());
                } else {
                  setStartDate(undefined);
                  setEndDate(undefined);
                }

                setShowFullTimerForm(checked);
              }}
            />
          }
        />
      ) : null}

      {journal.type === JournalType.Gauge ? (
        <TextField
          value={value}
          type="number"
          onChange={(event) => setValue(event.target.value)}
          label={"Value"}
          margin={"normal"}
          sx={{
            marginBottom: "0",
          }}
        />
      ) : null}

      {journal.type === JournalType.Timer && (entry || showFullTimerForm) ? (
        <UpsertTimerEntry
          startDate={startDate}
          setStartDate={(d) => setStartDate(d?.toString())}
          endDate={endDate}
          setEndDate={(d) => setEndDate(d?.toString())}
        />
      ) : null}

      {hasAttributes(journal) ? (
        <FormElementContainer>
          <AttributeComboSearch
            journal={journal}
            onChange={(values) => {
              resetSelectors();
              setAttributeValues(
                Object.keys(journal.attributes).reduce(
                  (previousValue: IJournalAttributeValues, key: string) => {
                    previousValue[key] = values[key] ?? [];
                    return previousValue;
                  },
                  {},
                ),
              );
            }}
          />
        </FormElementContainer>
      ) : null}

      {hasAttributes(journal) ? (
        <JournalAttributesSelector
          key={forceResetSelectors}
          attributes={journal.attributes}
          selectedAttributeValues={attributeValues}
          onChange={setAttributeValues}
        />
      ) : null}

      <TextField
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        multiline={true}
        label={"Notes"}
        margin={"normal"}
      />

      <DialogFormButtonContainer>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="contained"
          autoFocus={true}
          onClick={async () => {
            await ensureNewAttributeValues();

            await upsertEntryMutation.mutate({
              command: createCommand(),
            });
          }}
        >
          {entry?.id ? translations.edit : translations.add}
        </Button>
      </DialogFormButtonContainer>
    </FormControl>
  );

  function createCommand() {
    const command: IUpsertEntryCommand = {
      id: entry?.id,
      notes: notes,
      journalAttributeValues: attributeValues,
      journalId: journal.id,
      dateTime: new Date(date),
    };

    switch (journal.type) {
      case JournalType.Gauge:
        (command as IUpsertGaugeEntryCommand).value = !isNaN(value as never)
          ? Number(value)
          : undefined;
        break;

      case JournalType.Timer:
        (command as IUpsertTimerEntryCommand).startDate = new Date(startDate);
        (command as IUpsertTimerEntryCommand).endDate = new Date(endDate);
        break;
    }
    return command;
  }

  async function ensureNewAttributeValues() {
    let hasNewValues = false;

    for (const keyInValues in attributeValues) {
      for (const value of attributeValues[keyInValues]) {
        if (!journal.attributes[keyInValues].values[value]) {
          journal.attributes[keyInValues].values[value] = value;
          hasNewValues = true;
        }
      }
    }

    if (hasNewValues) {
      await editJournalMutation.mutateAsync({ journal: journal });
    }
  }

  function resetSelectors() {
    setForceResetSelectors(Math.random().toString());
  }
};
