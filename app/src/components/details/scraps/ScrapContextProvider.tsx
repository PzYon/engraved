import React, { useEffect, useMemo, useRef, useState } from "react";
import { IScrapEntry, ScrapType } from "../../../serverApi/IScrapEntry";
import { useAppContext } from "../../../AppContext";
import { Button, Typography } from "@mui/material";
import { IUpsertScrapsEntryCommand } from "../../../serverApi/commands/IUpsertScrapsEntryCommand";
import { useUpsertEntryMutation } from "../../../serverApi/reactQuery/mutations/useUpsertEntryMutation";
import { EntryPropsRenderStyle } from "../../common/entries/Entry";
import {
  ActionsRenderStyle,
  IScrapContext,
  ScrapContext,
} from "./ScrapContext";
import { IParsedDate } from "../edit/parseDate";
import {
  getScheduleDefinitionForUpsert,
  getScheduleForUser,
} from "../../overview/scheduled/scheduleUtils";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { IJournal } from "../../../serverApi/IJournal";
import { AddNewScrapStorage } from "./AddNewScrapStorage";
import { IScrapListItem } from "./list/IScrapListItem";
import { DialogFormButtonContainer } from "../../common/FormButtonContainer";
import {
  knownQueryParams,
  useItemAction,
} from "../../common/actions/searchParamHooks";
import { JournalType } from "../../../serverApi/JournalType";
import { dateOnlyToUtc, utcToDateOnly } from "../../../util/utils";

const quickAddStorageKey = "quick-add";

export const ScrapContextProvider: React.FC<{
  children: React.ReactNode;
  propsRenderStyle: EntryPropsRenderStyle;
  actionsRenderStyle?: ActionsRenderStyle;
  journal: IJournal;
  initialScrap: IScrapEntry;
  hasFocus: boolean;
  onSuccess?: () => void;
  onCancelEditing?: () => void;
  giveFocus?: () => void;
  isQuickAdd?: boolean;
  changeTypeWithoutConfirmation?: boolean;
}> = ({
  children,
  initialScrap,
  journal,
  propsRenderStyle,
  actionsRenderStyle,
  onSuccess,
  onCancelEditing,
  hasFocus,
  giveFocus,
  isQuickAdd,
  changeTypeWithoutConfirmation,
}) => {
  const { setAppAlert, user } = useAppContext();
  const { renderDialog } = useDialogContext();

  const isLogBook = journal?.type === JournalType.LogBook;

  const [scrapToRender, setScrapToRender] = useState(initialScrap);
  const [isEditMode, setIsEditMode] = useState(!scrapToRender.id);

  const [parsedDate, setParsedDate] = useState<IParsedDate | undefined>(
    undefined,
  );
  const [hasTitleFocus, setHasTitleFocus] = useState(false);

  // Auto-save can be turned off for an individual scrap. Defaults to enabled.
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);

  useEffect(() => {
    if (!isEditMode || !initialScrap?.parentId) {
      return;
    }

    AddNewScrapStorage.setForJournal(
      isQuickAdd ? quickAddStorageKey : (initialScrap.parentId ?? ""),
      {
        id: undefined,
        scrapType: scrapToRender.scrapType,
        notes: scrapToRender.notes,
        title: parsedDate?.text ?? scrapToRender.title ?? "",
        journalAttributeValues: undefined,
        parentId: initialScrap.parentId,
        dateTime: new Date().toISOString(),
      } as IScrapEntry,
    );
  }, [
    parsedDate?.text,
    initialScrap.parentId,
    initialScrap.scrapType,
    isEditMode,
    isQuickAdd,
    scrapToRender.notes,
    scrapToRender.title,
    scrapToRender.scrapType,
  ]);

  // Snapshot of the last content we persisted ourselves (manual or auto save).
  // Used to recognise the echo of our own save when it comes back through the
  // query cache, so it is not mistaken for a concurrent change from another tab.
  const lastSavedRef = useRef<{ notes: string | undefined; title: string }>(
    undefined,
  );

  const isDirty =
    initialScrap.notes !== scrapToRender.notes ||
    initialScrap.title !== scrapToRender.title;

  // True when a newer version of the scrap arrived (e.g. saved in another tab)
  // while we are still editing an older one. The "scrap has changed" merge
  // prompt is shown in this case, so any pending changes must not be silently
  // auto-saved - that would clobber the concurrent edit.
  const hasPendingBackgroundUpdate =
    !!initialScrap.editedOn && initialScrap.editedOn !== scrapToRender.editedOn;

  const journalId = initialScrap.parentId;

  const itemAction = useItemAction();

  const upsertEntryMutation = useUpsertEntryMutation(
    journalId ?? "",
    journal?.type ?? JournalType.Scraps,
    undefined, // scraps currently do not support attributes
    initialScrap.id,
    closeAddEntryAction,
  );

  useEffect(() => {
    if (
      !initialScrap.editedOn ||
      initialScrap.editedOn === scrapToRender.editedOn
    ) {
      return;
    }

    // The incoming version is the echo of a save we made ourselves (its content
    // matches what we last persisted). Adopt the new editedOn so we stay in sync,
    // but keep the user's current edits and do not show the "changed" prompt -
    // this is what lets auto-save keep the user in edit mode.
    if (
      lastSavedRef.current &&
      initialScrap.notes === lastSavedRef.current.notes &&
      initialScrap.title === lastSavedRef.current.title
    ) {
      setScrapToRender((prev) => ({
        ...prev,
        editedOn: initialScrap.editedOn,
      }));
      return;
    }

    if (!isEditMode) {
      resetToInitialScrap();
      return;
    }

    setAppAlert({
      message: (
        <>
          <div>Would you like to update? Any changes will be lost.</div>
          <div style={{ margin: "8px 0" }}>
            <Button
              sx={{
                color: "common.white",
                border: "1px solid white;",
                marginRight: "10px",
              }}
              variant="outlined"
              onClick={() => {
                resetToInitialScrap();
                setAppAlert(null);
              }}
            >
              YES
            </Button>

            <Button
              sx={{
                color: "common.white",
                border: "1px solid white;",
                paddingRight: "10px",
              }}
              variant="outlined"
              onClick={() => {
                setAppAlert(null);
              }}
            >
              NO
            </Button>
          </div>
        </>
      ),
      type: "info",
      hideDurationSec: 2,
      title: "Scrap has changed...",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialScrap]);

  function resetToInitialScrap() {
    setScrapToRender(initialScrap);
  }

  function changeScrapTypeInternal(
    genericNotes: string[],
    targetType: ScrapType,
  ) {
    function changeType() {
      const newNotes = convertNotesToTargetType(targetType, genericNotes);

      setScrapToRender({
        ...scrapToRender,
        notes: newNotes,
        scrapType: targetType,
      });
    }

    if (changeTypeWithoutConfirmation || isEmpty(genericNotes)) {
      changeType();
      return;
    }

    renderDialog({
      title: "Are you sure?",
      render: (closeDialog) => {
        return (
          <>
            <Typography>
              Do you really want to change the type to {targetType}? Certain
              formatting might be lost.
            </Typography>

            <DialogFormButtonContainer>
              <Button variant="contained" onClick={closeDialog}>
                No
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  changeType();
                  closeDialog();
                }}
              >
                Yes, convert to {targetType.toLowerCase()}
              </Button>
            </DialogFormButtonContainer>
          </>
        );
      },
    });
  }

  function closeAddEntryAction() {
    if (itemAction.getParams()[knownQueryParams.actionKey] === "add-entry") {
      itemAction.closeAction();
    }
  }

  const contextValue = useMemo<IScrapContext>(
    () => {
      return {
        journal,
        title: scrapToRender.title,
        setTitle: (t) => setScrapToRender({ ...scrapToRender, title: t }),
        notes: scrapToRender.notes,
        setNotes: (n) => setScrapToRender({ ...scrapToRender, notes: n }),
        // LogBook entries are date-only and stored as UTC midnight. Convert at this boundary so
        // the rest of the (local-time) UI keeps working and the shown calendar day is stable
        // regardless of the viewer's timezone.
        date: isLogBook
          ? utcToDateOnly(new Date(scrapToRender.dateTime))
          : new Date(scrapToRender.dateTime),
        setDate: (d) =>
          setScrapToRender({
            ...scrapToRender,
            dateTime: d
              ? (isLogBook ? dateOnlyToUtc(d) : d).toJSON()
              : new Date().toJSON(),
          }),
        parsedDate,
        setParsedDate,
        isEditMode,
        setIsEditMode,
        isDirty,
        hasPendingBackgroundUpdate,
        isAutoSaveEnabled,
        setIsAutoSaveEnabled,
        cancelEditingAction: !isEditMode
          ? null
          : ActionFactory.cancelEditing(
              () => {
                resetToInitialScrap();

                setIsEditMode(false);

                onCancelEditing?.();

                closeAddEntryAction();

                AddNewScrapStorage.clearForJournal(
                  isQuickAdd
                    ? quickAddStorageKey
                    : (journal?.id ?? initialScrap.parentId ?? ""),
                );
              },
              hasFocus,
              isDirty,
              renderDialog,
            ),
        upsertScrap,
        scrapToRender,
        propsRenderStyle,
        actionsRenderStyle,
        onSuccess,
        hasFocus,
        giveFocus,
        hasTitleFocus,
        setHasTitleFocus,
        changeScrapType: changeScrapTypeInternal,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      initialScrap,
      isEditMode,
      isDirty,
      scrapToRender,
      propsRenderStyle,
      actionsRenderStyle,
      journal,
      hasFocus,
      giveFocus,
      hasTitleFocus,
      hasPendingBackgroundUpdate,
      isAutoSaveEnabled,
    ],
  );

  async function upsertScrap(notesToOverride?: string, keepEditMode?: boolean) {
    const notesToSave = getNotesToPersist(
      scrapToRender.scrapType,
      notesToOverride ?? scrapToRender.notes,
    );

    if (!notesToSave && !scrapToRender.title) {
      return;
    }

    // Auto-save (keepEditMode) persists silently and leaves the user editing;
    // edit mode is only closed when the user explicitly saves or cancels.
    if (scrapToRender.id && !keepEditMode) {
      setIsEditMode(false);
    }

    if (
      !isDirty &&
      initialScrap.notes === notesToSave &&
      initialScrap.title === scrapToRender.title
    ) {
      return;
    }

    const titleToSave = parsedDate?.text ?? scrapToRender.title;
    lastSavedRef.current = { notes: notesToSave, title: titleToSave };

    if (!keepEditMode) {
      onSuccess?.();
    }

    await upsertEntryMutation.mutateAsync({
      command: {
        id: scrapToRender.id,
        scrapType: scrapToRender.scrapType,
        notes: notesToSave,
        title: titleToSave,
        journalAttributeValues: {},
        journalId: journalId ?? "",
        dateTime: scrapToRender.dateTime
          ? new Date(scrapToRender.dateTime)
          : new Date(),
        // Preserve an existing schedule when the title (and therefore the date)
        // was not touched - otherwise auto-save would clear it.
        schedule: getScheduleDefinitionForUpsert(
          parsedDate,
          getScheduleForUser(initialScrap, user?.id ?? ""),
          journalId,
          scrapToRender?.id ?? "new-entry-id",
        ),
      } as IUpsertScrapsEntryCommand,
    });

    if (keepEditMode) {
      return;
    }

    setIsEditMode(false);

    AddNewScrapStorage.clearForJournal(
      isQuickAdd ? quickAddStorageKey : (scrapToRender.parentId ?? ""),
    );
  }

  return (
    <ScrapContext.Provider value={contextValue}>
      {children}
    </ScrapContext.Provider>
  );

  function isEmpty(genericNotes: string[]) {
    return genericNotes.map((s) => s?.trim() ?? "").join("") === "";
  }
};

// While editing, a list always keeps at least one (possibly blank) line so the
// user has something to type into. When that lone line is still empty on save,
// the list is effectively empty and is persisted as such rather than storing a
// meaningless blank item.
function getNotesToPersist(scrapType: ScrapType, notes: string | undefined) {
  if (scrapType !== ScrapType.List || !notes) {
    return notes;
  }

  let items: IScrapListItem[];
  try {
    items = JSON.parse(notes);
  } catch {
    return notes;
  }

  if (items.length === 1 && !items[0]?.label?.trim()) {
    return JSON.stringify([]);
  }

  return notes;
}

function convertNotesToTargetType(
  targetType: ScrapType,
  genericNotes: string[],
) {
  switch (targetType) {
    case ScrapType.List:
      return JSON.stringify(
        genericNotes.length
          ? genericNotes.map((n) => ({ label: n }) as IScrapListItem)
          : [
              {
                label: "",
                depth: 0,
                isCompleted: false,
              } as IScrapListItem,
            ],
      );

    case ScrapType.Markdown:
      return genericNotes.map((n) => "- " + n).join("\n");
  }
}
