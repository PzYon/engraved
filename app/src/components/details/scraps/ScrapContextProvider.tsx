import React, { useEffect, useMemo, useState } from "react";
import { IScrapEntry, ScrapType } from "../../../serverApi/IScrapEntry";
import { useAppContext } from "../../../AppContext";
import { Button, Typography } from "@mui/material";
import { IUpsertScrapsEntryCommand } from "../../../serverApi/commands/IUpsertScrapsEntryCommand";
import { useUpsertEntryMutation } from "../../../serverApi/reactQuery/mutations/useUpsertEntryMutation";
import { JournalType } from "../../../serverApi/JournalType";
import { EntryPropsRenderStyle } from "../../common/entries/Entry";
import {
  ActionsRenderStyle,
  IScrapContext,
  ScrapContext,
} from "./ScrapContext";
import { IParsedDate } from "../edit/parseDate";
import { getScheduleDefinition } from "../../overview/scheduled/scheduleUtils";
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
  targetJournalId?: string;
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
  targetJournalId,
  changeTypeWithoutConfirmation,
}) => {
  const { setAppAlert } = useAppContext();
  const { renderDialog } = useDialogContext();

  const [notes, setNotes] = useState<string>(initialScrap.notes);
  const [title, setTitle] = useState<string>(initialScrap.title);
  const [parsedDate, setParsedDate] = useState<IParsedDate>(undefined);
  const [scrapToRender, setScrapToRender] = useState(initialScrap);
  const [isEditMode, setIsEditMode] = useState(!scrapToRender.id);
  const [hasTitleFocus, setHasTitleFocus] = useState(false);

  useEffect(() => {
    if (!isEditMode || !initialScrap?.parentId) {
      return;
    }

    AddNewScrapStorage.setForJournal(
      isQuickAdd ? "quick-add" : initialScrap.parentId,
      {
        id: null,
        scrapType: scrapToRender.scrapType,
        notes: notes,
        title: parsedDate?.text ?? title,
        journalAttributeValues: {},
        parentId: targetJournalId ?? initialScrap.parentId,
        dateTime: null,
      },
    );
  }, [
    parsedDate?.text,
    targetJournalId,
    initialScrap.parentId,
    initialScrap.scrapType,
    isEditMode,
    isQuickAdd,
    scrapToRender.scrapType,
    notes,
    title,
  ]);

  const isDirty = initialScrap.notes !== notes || initialScrap.title !== title;

  const itemAction = useItemAction();

  const upsertEntryMutation = useUpsertEntryMutation(
    initialScrap.parentId,
    JournalType.Scraps,
    null, // scrap currently do not support attributes
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

    if (!isEditMode) {
      updateScrapInState();
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
              variant={"outlined"}
              onClick={() => {
                updateScrapInState();
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
              variant={"outlined"}
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

  function updateScrapInState() {
    setScrapToRender(initialScrap);
    setTitle(initialScrap.title);
    setNotes(initialScrap.notes);
  }

  function changeScrapTypeInternal(
    genericNotes: string[],
    targetType: ScrapType,
  ) {
    function changeType() {
      const newNotes = convertNotesToTargetType(targetType, genericNotes);

      setNotes(newNotes);

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
              <Button variant={"contained"} onClick={closeDialog}>
                No
              </Button>
              <Button
                variant={"outlined"}
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
        title,
        setTitle,
        notes,
        setNotes,
        parsedDate,
        setParsedDate,
        isEditMode,
        setIsEditMode,
        isDirty,
        cancelEditingAction: !isEditMode
          ? null
          : ActionFactory.cancelEditing(
              () => {
                setScrapToRender(initialScrap);
                setTitle(initialScrap.title);
                setNotes(initialScrap.notes);
                setIsEditMode(false);

                onCancelEditing?.();

                closeAddEntryAction();

                AddNewScrapStorage.clearForJournal(
                  isQuickAdd
                    ? "quick-add"
                    : (journal?.id ?? initialScrap.parentId),
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
      title,
      notes,
      isEditMode,
      isDirty,
      scrapToRender,
      propsRenderStyle,
      actionsRenderStyle,
      journal,
      hasFocus,
      giveFocus,
      hasTitleFocus,
    ],
  );

  async function upsertScrap(notesToOverride?: string) {
    const notesToSave = notesToOverride ?? notes;

    if (!notesToSave && !title) {
      return;
    }

    if (scrapToRender.id) {
      setIsEditMode(false);
    }

    if (
      !isDirty &&
      initialScrap.notes === notesToSave &&
      initialScrap.title === title
    ) {
      return;
    }

    onSuccess?.();

    await upsertEntryMutation.mutateAsync({
      command: {
        id: scrapToRender.id,
        scrapType: scrapToRender.scrapType,
        notes: notesToSave,
        title: parsedDate?.text ?? title,
        journalAttributeValues: {},
        journalId: targetJournalId ?? scrapToRender.parentId,
        dateTime: new Date(),
        schedule: getScheduleDefinition(
          parsedDate,
          scrapToRender.parentId,
          scrapToRender?.id ?? "new-entry-id",
        ),
      } as IUpsertScrapsEntryCommand,
    });

    AddNewScrapStorage.clearForJournal(
      isQuickAdd ? "quick-add" : scrapToRender.parentId,
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
