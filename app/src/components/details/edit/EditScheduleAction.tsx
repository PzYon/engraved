import React, { useEffect, useState } from "react";
import { styled } from "@mui/material";
import { useModifyScheduleMutation } from "../../../serverApi/reactQuery/mutations/useModifyScheduleMutation";
import { IScheduleDefinition } from "../../../serverApi/IScheduleDefinition";
import { IParsedDate } from "./parseDate";
import { IEntity } from "../../../serverApi/IEntity";
import {
  getScheduleDefinition,
  getScheduleForUser,
  getScheduleProperty,
} from "../../overview/scheduled/scheduleUtils";
import { IJournal } from "../../../serverApi/IJournal";
import { useAppContext } from "../../../AppContext";
import { IEntry } from "../../../serverApi/IEntry";
import { ISchedule } from "../../../serverApi/ISchedule";
import { Properties } from "../../common/Properties";
import EditNotificationsOutlined from "@mui/icons-material/EditNotificationsOutlined";
import { ActionIconButton } from "../../common/actions/ActionIconButton";
import { isAfter } from "date-fns";
import { useItemAction } from "../../common/actions/searchParamHooks";
import { ScheduleActions } from "./ScheduleActions";
import { ScheduleEditForm } from "./ScheduleEditForm";

export const EditScheduleAction: React.FC<{
  journal?: IJournal;
  entry?: IEntry;
}> = ({ journal, entry }) => {
  const [parsed, setParsed] = useState<IParsedDate>({ input: "" });

  const [isDirty, setIsDirty] = useState(false);

  const { user } = useAppContext();

  const schedule: ISchedule | undefined = (
    entry ? entry.schedules : journal?.schedules
  )?.[user.id ?? ""];

  const hasSchedule = !!schedule?.nextOccurrence;
  const isRecurring = !!schedule?.recurrence?.dateString;
  const isInPast =
    hasSchedule && schedule?.nextOccurrence
      ? isAfter(new Date(), schedule.nextOccurrence)
      : false;
  const isInFuture = hasSchedule && !isInPast;

  const { closeAction } = useItemAction();

  useEffect(() => {
    const entity: IEntity | undefined = entry?.id ? entry : journal;

    const nextOccurrence = entity
      ? getScheduleForUser(entity, user.id ?? "").nextOccurrence
      : null;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParsed({
      date: nextOccurrence ? new Date(nextOccurrence) : undefined,
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
            properties={[
              (journal ?? entry)
                ? getScheduleProperty((journal ?? entry)!, user.id ?? "")
                : null,
            ].filter((p): p is NonNullable<typeof p> => p != null)}
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

      <ScheduleActions
        hasSchedule={hasSchedule}
        isRecurring={isRecurring}
        isInPast={isInPast}
        isInFuture={isInFuture}
        schedule={schedule}
        entry={entry}
        journal={journal}
        modifyScheduleMutation={modifyScheduleMutation}
      />

      {hasSchedule && isEditMode ? <Spacer /> : null}

      {isEditMode ? (
        <ScheduleEditForm
          parsed={parsed}
          isDirty={isDirty}
          showFullForm={showFullForm}
          setShowFullForm={setShowFullForm}
          setParsed={setParsed}
          setIsDirty={setIsDirty}
          save={save}
          closeAction={closeAction}
        />
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

const Spacer = styled("div")`
  margin-top: ${(p) => p.theme.spacing(3)};
  margin-bottom: ${(p) => p.theme.spacing(2)};
  border-top: 1px solid ${(p) => p.theme.palette.background.default};
`;
