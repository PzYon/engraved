import React, { useEffect, useMemo, useState } from "react";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { useAppContext } from "../../../AppContext";
import { Button } from "@mui/material";
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

export const ScrapContextProvider: React.FC<{
  children: React.ReactNode;
  propsRenderStyle: EntryPropsRenderStyle;
  actionsRenderStyle?: ActionsRenderStyle;
  journalName: string;
  hasFocus: boolean;
  currentScrap: IScrapEntry;
  onSuccess?: () => void;
  giveFocus?: () => void;
}> = ({
  children,
  currentScrap,
  propsRenderStyle,
  actionsRenderStyle,
  journalName,
  onSuccess,
  hasFocus,
  giveFocus,
}) => {
  const { setAppAlert } = useAppContext();

  const [notes, setNotes] = useState<string>(currentScrap.notes);
  const [title, setTitle] = useState<string>(currentScrap.title);
  const [parsedDate, setParsedDate] = useState<IParsedDate>(undefined);
  const [scrapToRender, setScrapToRender] = useState(currentScrap);
  const [isEditMode, setIsEditMode] = useState(!scrapToRender.id);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialScrap = useMemo(() => currentScrap, []);

  const isDirty = useMemo(
    () => initialScrap.notes !== notes || initialScrap.title !== title,
    [initialScrap, notes, title],
  );

  const upsertEntryMutation = useUpsertEntryMutation(
    currentScrap.parentId,
    JournalType.Scraps,
    null, // scrap currently do not support attributes
    currentScrap.id,
  );

  useEffect(() => {
    if (
      !currentScrap.editedOn ||
      currentScrap.editedOn === scrapToRender.editedOn
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
  }, [currentScrap]);

  function updateScrapInState() {
    setScrapToRender(currentScrap);
    setTitle(currentScrap.title);
    setNotes(currentScrap.notes);
  }

  const contextValue = useMemo<IScrapContext>(
    () => {
      return {
        title,
        setTitle,
        notes,
        setNotes,
        parsedDate,
        setParsedDate,
        isEditMode,
        setIsEditMode,
        isDirty,
        getCancelEditingFunction: () => {
          if (!isEditMode) {
            return null;
          }

          return () => {
            setScrapToRender(initialScrap);
            setTitle(initialScrap.title);
            setNotes(initialScrap.notes);
            setIsEditMode(false);
          };
        },
        upsertScrap,
        scrapToRender,
        propsRenderStyle,
        actionsRenderStyle,
        journalName,
        onSuccess,
        hasFocus,
        giveFocus,
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
      journalName,
      hasFocus,
      giveFocus,
    ],
  );

  async function upsertScrap(notesToOverride?: string) {
    const notesToSave = notesToOverride ?? notes;

    if (!notesToSave && !title) {
      return;
    }

    setIsEditMode(false);

    if (currentScrap.notes === notesToSave && currentScrap.title === title) {
      return;
    }

    onSuccess?.();

    await upsertEntryMutation.mutateAsync({
      command: {
        id: currentScrap.id,
        scrapType: currentScrap.scrapType,
        notes: notesToSave,
        title: parsedDate?.text ?? title,
        journalAttributeValues: {},
        journalId: currentScrap.parentId,
        dateTime: new Date(),
        schedule: getScheduleDefinition(
          parsedDate,
          currentScrap.parentId,
          currentScrap?.id ?? "{0}",
        ),
      } as IUpsertScrapsEntryCommand,
    });
  }

  return (
    <ScrapContext.Provider value={contextValue}>
      {children}
    </ScrapContext.Provider>
  );
};
