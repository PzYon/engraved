import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
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
import { AttributeComboSearch } from "./AttributeComboSearch";
import {
  getDefaultAttributeValues,
  getValueHeaderLabel,
  hasAttributes,
  showAttributeSearch,
} from "../../../util/journalUtils";
import { UpsertTimerEntry } from "./UpsertTimerEntry";
import { IUpsertTimerEntryCommand } from "../../../serverApi/commands/IUpsertTimerEntryCommand";
import { useUpsertEntryMutation } from "../../../serverApi/reactQuery/mutations/useUpsertEntryMutation";
import { DialogFormButtonContainer } from "../../common/FormButtonContainer";
import { IGaugeEntry } from "../../../serverApi/IGaugeEntry";
import { ServerApi } from "../../../serverApi/ServerApi";
import { Scrap } from "../scraps/Scrap";
import { ScrapsJournalType } from "../../../journalTypes/ScrapsJournalType";
import { IScrapEntry, ScrapType } from "../../../serverApi/IScrapEntry";
import { useItemAction } from "../../common/actions/searchParamHooks";
import { LogBookJournalType } from "../../../journalTypes/LogBookJournalType";
import {
  onlineManager,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { queryKeysFactory } from "../../../serverApi/reactQuery/queryKeysFactory";

export const UpsertEntryAction: React.FC<{
  journal?: IJournal;
  entry?: IEntry;
}> = ({ journal: initialJournal, entry: initialEntry }) => {
  const { journal, entry } = useUpsertEntryData(initialJournal, initialEntry);

  if (
    journal.type === JournalType.Scraps ||
    journal.type === JournalType.LogBook
  ) {
    return (
      <Scrap
        scrap={(entry as IScrapEntry) ?? createNewEntry()}
        testId="add-new-scrap"
        hasFocus={true}
        journal={journal}
        actionsRenderStyle={"save-only"}
        propsRenderStyle={"none"}
      />
    );
  }

  return (
    <UpsertEntryActionInternal journal={journal} entry={entry ?? undefined} />
  );

  function createNewEntry(): IScrapEntry {
    return journal.type === JournalType.LogBook
      ? LogBookJournalType.createBlank(journal)
      : ScrapsJournalType.createBlank(
          false,
          journal.id ?? "",
          ScrapType.Markdown,
        );
  }
};

const UpsertEntryActionInternal: React.FC<{
  journal: IJournal;
  entry?: IEntry;
}> = ({ journal, entry }) => {
  const [attributeValues, setAttributeValues] =
    useState<IJournalAttributeValues>(
      entry?.journalAttributeValues ||
        getDefaultAttributeValues(journal.attributes ?? {}),
    ); // empty means nothing selected in the selector

  const [notes, setNotes] = useState<string>(entry?.notes || "");

  const [forceResetSelectors, setForceResetSelectors] = useState("initial");

  const [value, setValue] = useState<string>(
    (entry as IGaugeEntry)?.value?.toString() || "",
  );

  const [date, setDate] = useState<Date>(
    entry?.dateTime ? new Date(entry.dateTime) : new Date(),
  );

  const [startDate, setStartDate] = useState<string | undefined>(
    (entry as ITimerEntry)?.startDate,
  );

  const [endDate, setEndDate] = useState<string | undefined>(
    (entry as ITimerEntry)?.endDate,
  );

  const [showFullTimerForm, setShowFullTimerForm] = useState(false);

  const { closeAction } = useItemAction();

  const valueInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => valueInputRef.current?.focus());
  }, []);

  const upsertEntryMutation = useUpsertEntryMutation(
    journal.id ?? "",
    journal.type,
    journal,
    entry?.id,
  );

  return (
    <FormControl sx={{ width: "100%" }}>
      {journal.type !== JournalType.Timer ? (
        <FormElementContainer>
          <DateSelector setDate={(d) => setDate(d ?? new Date())} date={date} />
        </FormElementContainer>
      ) : null}

      {journal.type === JournalType.Timer && !entry ? (
        <FormControlLabel
          label="Show full form"
          control={
            <Switch
              onChange={(_, checked) => {
                if (!checked) {
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
          inputRef={valueInputRef}
          onChange={(event) => setValue(event.target.value)}
          label={getValueHeaderLabel(journal)}
          margin={"normal"}
          sx={{ marginBottom: "0" }}
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

      {showAttributeSearch(journal) ? (
        <FormElementContainer>
          <AttributeComboSearch
            journal={journal}
            onChange={(values) => {
              resetSelectors();
              setAttributeValues(
                Object.keys(journal.attributes ?? {}).reduce(
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
          attributes={journal.attributes ?? {}}
          selectedAttributeValues={attributeValues}
          onChange={setAttributeValues}
        />
      ) : null}

      <FormElementContainer>
        <TextField
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          multiline={true}
          label={"Notes"}
          margin={"normal"}
          sx={{ width: "100%" }}
        />
      </FormElementContainer>

      <DialogFormButtonContainer>
        <Button variant="outlined" onClick={closeAction}>
          Cancel
        </Button>
        <Button
          variant="contained"
          autoFocus={true}
          onClick={async () => {
            await upsertEntryMutation.mutate({
              command: createCommand(),
            });

            closeAction();
          }}
        >
          {entry?.id ? "Update entry" : "Add entry"}
        </Button>
      </DialogFormButtonContainer>
    </FormControl>
  );

  function createCommand() {
    const command: IUpsertEntryCommand = {
      id: entry?.id,
      notes: notes,
      journalAttributeValues: attributeValues,
      journalId: journal.id ?? "",
      dateTime: new Date(date),
    };

    switch (journal.type) {
      case JournalType.Gauge: {
        (command as IUpsertGaugeEntryCommand).value = !isNaN(value as never)
          ? Number(value)
          : 0;
        break;
      }

      case JournalType.Timer: {
        const timerCommand = command as IUpsertTimerEntryCommand;
        // the client decides and sends explicit dates instead of leaving them empty and letting
        // the server fill in "now" at apply time: saving without dates means "start now" for a
        // new entry and "stop now" for the running one. This keeps the command idempotent when
        // it is replayed from the offline outbox at a later point in time.
        timerCommand.startDate = startDate
          ? new Date(startDate)
          : entry
            ? undefined
            : new Date();
        timerCommand.endDate = endDate
          ? new Date(endDate)
          : entry && !(entry as ITimerEntry).endDate
            ? new Date()
            : undefined;
        break;
      }
    }
    return command;
  }

  function resetSelectors() {
    setForceResetSelectors(Math.random().toString());
  }
};

const useUpsertEntryData = (
  initialJournal?: IJournal,
  initialEntry?: IEntry,
): { journal: IJournal; entry: IEntry | null } => {
  type UpsertEntryDataQueryParams = {
    initialJournal?: IJournal;
    initialEntry?: IEntry;
    initialEntryParentId: string | null;
  };

  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery({
    queryKey: [
      "upsert-entry-data",
      {
        initialJournal,
        initialEntry,
        initialEntryParentId: initialEntry?.parentId ?? null,
      },
    ],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey as [string, UpsertEntryDataQueryParams];

      const journal = params.initialJournal
        ? params.initialJournal
        : await ServerApi.getJournal(params.initialEntryParentId!);

      const entry = params.initialEntry
        ? params.initialEntry
        : journal.type !== JournalType.Timer
          ? null
          : await getActiveEntry(journal);

      return { journal, entry };
    },
  });

  return data;

  // The active (i.e. running) timer entry decides whether saving means start or stop. While
  // offline the server cannot be asked, so it is derived from the cached entries instead - the
  // client deciding over local state is exactly what makes the resulting command replayable.
  async function getActiveEntry(journal: IJournal): Promise<IEntry | null> {
    try {
      return await ServerApi.getActiveEntry(journal.id ?? "");
    } catch (e) {
      if (onlineManager.isOnline()) {
        throw e;
      }

      const cachedEntryLists = queryClient.getQueriesData<ITimerEntry[]>({
        queryKey: queryKeysFactory.prefixes.journalEntries(journal.id ?? ""),
      });

      for (const [, entries] of cachedEntryLists) {
        const activeEntry = entries?.find((en) => en.startDate && !en.endDate);
        if (activeEntry) {
          return activeEntry;
        }
      }

      return null;
    }
  }
};
