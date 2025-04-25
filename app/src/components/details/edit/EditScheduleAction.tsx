import React, { useEffect, useState } from "react";
import { DialogFormButtonContainer } from "../../common/FormButtonContainer";
import { Button, FormControlLabel, styled, Switch } from "@mui/material";
import { useModifyScheduleMutation } from "../../../serverApi/reactQuery/mutations/useModifyScheduleMutation";
import { ParseableDate } from "./ParseableDate";
import { DateSelector } from "../../common/DateSelector";
import { IScheduleDefinition } from "../../../serverApi/IScheduleDefinition";
import { IParsedDate, parseDate } from "./parseDate";
import { IEntity } from "../../../serverApi/IEntity";
import {
  getScheduleDefinition,
  getScheduleForUser,
} from "../../overview/scheduled/scheduleUtils";
import { IJournal } from "../../../serverApi/IJournal";
import { ServerApi } from "../../../serverApi/ServerApi";
import { useAppContext } from "../../../AppContext";
import { IEntry } from "../../../serverApi/IEntry";
import {
  getItemActionQueryParams,
  useItemAction,
} from "../../common/actions/searchParamHooks";
import { ScheduledInfo } from "../../overview/scheduled/ScheduledInfo";
import { ISchedule } from "../../../serverApi/ISchedule";
import { isAfter } from "date-fns";

export const EditScheduleAction: React.FC<{
  journal?: IJournal;
  entry?: IEntry;
}> = ({ journal, entry }) => {
  const [parsed, setParsed] = useState<IParsedDate>({ input: undefined });

  const [isDirty, setIsDirty] = useState(false);

  const { user } = useAppContext();

  const schedule: ISchedule = (entry ? entry.schedules : journal.schedules)?.[
    user.id
  ];

  const isRecurring = !!schedule?.recurrence?.dateString;

  const { closeAction } = useItemAction();

  useEffect(() => {
    getNextOccurrence().then((d) => {
      setParsed({
        date: d ? new Date(d) : null,
        input: parsed.input,
      });
    });

    async function getNextOccurrence() {
      const entity: IEntity = await (entry?.id
        ? ServerApi.getEntry(entry.id)
        : Promise.resolve(journal));

      if (!entity) {
        return null;
      }

      return getScheduleForUser(entity, user.id).nextOccurrence;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modifyScheduleMutation = useModifyScheduleMutation(
    journal?.id ?? entry?.parentId,
    entry?.id,
  );

  const [showFullForm, setShowFullForm] = useState(!!parsed.date || !!schedule);

  return (
    <Host>
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
        onChange={(d) => {
          setParsed(d);
          setIsDirty(!!d.date);
        }}
        onSelect={save}
      />

      {showFullForm ? (
        <DateSelector
          date={parsed.date}
          setDate={(d) => {
            setParsed({ date: d, input: parsed.text });
            setIsDirty(true);
          }}
          showTime={true}
          showClear={true}
        />
      ) : null}

      {!!schedule &&
      (isAfter(new Date(), schedule.nextOccurrence) ||
        !schedule.recurrence?.dateString) ? (
        <Button
          variant={"contained"}
          onClick={() => {
            const scheduleDefinition: IScheduleDefinition = {
              nextOccurrence: schedule.recurrence
                ? parseDate(schedule.recurrence.dateString).date
                : null,
              recurrence: schedule.recurrence,
              onClickUrl: entry
                ? `${location.origin}/journals/details/${entry.parentId}/?${new URLSearchParams(getItemActionQueryParams("schedule", entry.id)).toString()}`
                : `${location.origin}/journals/details/${journal.id}/?${new URLSearchParams(getItemActionQueryParams("schedule", journal.id)).toString()}`,
            };

            modifyScheduleMutation.mutate(scheduleDefinition);

            closeAction();
          }}
        >
          {getScheduleButtonLabel()}
        </Button>
      ) : null}

      <DialogFormButtonContainer sx={{ paddingTop: 0 }}>
        <Button variant="outlined" onClick={closeAction}>
          Cancel
        </Button>
        <Button variant="contained" onClick={save} disabled={!isDirty}>
          Save
        </Button>
      </DialogFormButtonContainer>
    </Host>
  );

  function save() {
    const scheduleDefinition: IScheduleDefinition = getScheduleDefinition(
      parsed,
      journal?.id ?? entry?.parentId,
      entry?.id || "",
    );

    modifyScheduleMutation.mutate(scheduleDefinition);

    closeAction();
  }

  function getScheduleButtonLabel() {
    return isRecurring ? (
      <>
        Reschedule&nbsp;
        <ScheduledInfo
          schedule={schedule}
          showNextIfPassed={true}
          showRecurrenceInfo={true}
        />
      </>
    ) : (
      <>Mark {entry ? "entry" : "journal"} as done</>
    );
  }
};

const Host = styled("div")`
  width: 100%;
`;
