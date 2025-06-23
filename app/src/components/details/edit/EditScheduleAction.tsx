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
  getScheduleProperty,
} from "../../overview/scheduled/scheduleUtils";
import { IJournal } from "../../../serverApi/IJournal";
import { useAppContext } from "../../../AppContext";
import { IEntry } from "../../../serverApi/IEntry";
import {
  getItemActionQueryParams,
  useItemAction,
} from "../../common/actions/searchParamHooks";
import { ScheduledInfo } from "../../overview/scheduled/ScheduledInfo";
import { ISchedule } from "../../../serverApi/ISchedule";
import { Properties } from "../../common/Properties";
import { EditNotificationsOutlined } from "@mui/icons-material";
import { ActionIconButton } from "../../common/actions/ActionIconButton";
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

  const hasSchedule = !!schedule?.nextOccurrence;
  const isRecurring = !!schedule?.recurrence?.dateString;
  const isInPast = hasSchedule && isAfter(new Date(), schedule.nextOccurrence);
  const isInFuture = hasSchedule && !isInPast;

  const { closeAction } = useItemAction();

  useEffect(() => {
    const entity: IEntity = entry?.id ? entry : journal;

    const nextOccurrence = entity
      ? getScheduleForUser(entity, user.id).nextOccurrence
      : null;

    setParsed({
      date: nextOccurrence ? new Date(nextOccurrence) : null,
      input: parsed.input,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modifyScheduleMutation = useModifyScheduleMutation(
    journal?.id ?? entry?.parentId,
    entry?.id,
  );

  const [showFullForm, setShowFullForm] = useState(
    !!parsed.date || hasSchedule,
  );

  const [isEditMode, setIsEditMode] = useState(!hasSchedule);

  return (
    <Host>
      {hasSchedule ? (
        <ActualScheduleContainer>
          <Properties
            properties={[getScheduleProperty(journal ?? entry, user.id)]}
          />
          {isEditMode ? null : (
            <ActionIconButton
              action={{
                key: "edit-mode",
                label: "Show edit controls",
                icon: <EditNotificationsOutlined fontSize="small" />,
                onClick: () => setIsEditMode(true),
              }}
            />
          )}
        </ActualScheduleContainer>
      ) : null}

      <MainButtons>
        {hasSchedule && (isInPast || !isRecurring) ? (
          <Button
            sx={{ width: "100%" }}
            variant={"contained"}
            onClick={() => {
              const scheduleDefinition: IScheduleDefinition = {
                nextOccurrence: isRecurring
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
            {isRecurring ? (
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
            )}
          </Button>
        ) : null}

        {hasSchedule &&
        (isInFuture || isRecurring) &&
        !(isInPast || !isRecurring) ? (
          <Button
            sx={{ width: "100%" }}
            variant={"contained"}
            onClick={() => {
              const scheduleDefinition: IScheduleDefinition = {
                nextOccurrence: null,
                onClickUrl: null,
              };

              modifyScheduleMutation.mutate(scheduleDefinition);

              closeAction();
            }}
          >
            {!isInFuture ? (
              <>Mark {entry ? "entry" : "journal"} as done</>
            ) : (
              "Remove schedule"
            )}
          </Button>
        ) : null}
      </MainButtons>

      {hasSchedule && isEditMode ? <Spacer /> : null}

      {isEditMode ? (
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

          <DialogFormButtonContainer sx={{ paddingTop: 0 }}>
            <Button variant="outlined" onClick={closeAction}>
              Cancel
            </Button>

            <Button variant="contained" onClick={save} disabled={!isDirty}>
              Save
            </Button>
          </DialogFormButtonContainer>
        </>
      ) : null}
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
};

const Host = styled("div")`
  width: 100%;
`;

const ActualScheduleContainer = styled("div")`
  display: flex;
  gap: ${(p) => p.theme.spacing(2)};
  align-items: center;
`;

const MainButtons = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: ${(p) => p.theme.spacing(2)};

  &:empty {
    display: none;
  }
`;

const Spacer = styled("div")`
  margin-top: ${(p) => p.theme.spacing(3)};
  margin-bottom: ${(p) => p.theme.spacing(2)};
  border-top: 1px solid ${(p) => p.theme.palette.background.default};
`;
