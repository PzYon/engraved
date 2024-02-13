import React, {
  createContext,
  MutableRefObject,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { useAppContext } from "../../../AppContext";
import { Button } from "@mui/material";
import { IUpsertScrapsEntryCommand } from "../../../serverApi/commands/IUpsertScrapsEntryCommand";
import { useUpsertEntryMutation } from "../../../serverApi/reactQuery/mutations/useUpsertEntryMutation";
import { JournalType } from "../../../serverApi/JournalType";
import { ScrapItemWrapper } from "./ScrapItemWrapper";
import { EntryPropsRenderStyle } from "../../common/entries/Entry";

export type ActionsRenderStyle = "save-only" | "none" | "all";

export interface IScrapContext {
  title: string;
  setTitle: (title: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
  isDirty: boolean;
  getCancelEditingFunction: () => () => void;
  upsertScrap: (notesToOverride?: string) => Promise<void>;
  scrapToRender: IScrapEntry;
  propsRenderStyle: EntryPropsRenderStyle;
  actionsRenderStyle?: ActionsRenderStyle;
  journalName: string;
  onSuccess?: () => void;
  hasFocus: boolean;
  hasTitleFocus: boolean;
  setHasTitleFocus: (value: boolean) => void;
}

const ScrapContext = createContext<IScrapContext>({
  title: null,
  setTitle: null,
  notes: null,
  setNotes: null,
  isEditMode: null,
  setIsEditMode: null,
  isDirty: null,
  getCancelEditingFunction: null,
  upsertScrap: null,
  scrapToRender: null,
  propsRenderStyle: null,
  actionsRenderStyle: null,
  journalName: null,
  onSuccess: null,
  hasFocus: null,
  hasTitleFocus: null,
  setHasTitleFocus: null,
});

export const useScrapContext = () => {
  return useContext(ScrapContext);
};

export const ScrapContextProvider: React.FC<{
  children: React.ReactNode;
  domElementRef: MutableRefObject<HTMLDivElement>;
  propsRenderStyle: EntryPropsRenderStyle;
  actionsRenderStyle?: ActionsRenderStyle;
  journalName: string;
  hasFocus: boolean;
  currentScrap: IScrapEntry;
  onSuccess?: () => void;
  addScrapWrapper?: (scrapWrapper: ScrapItemWrapper) => void;
}> = ({
  children,
  currentScrap,
  addScrapWrapper,
  domElementRef,
  propsRenderStyle,
  actionsRenderStyle,
  journalName,
  onSuccess,
  hasFocus,
}) => {
  const { setAppAlert } = useAppContext();

  const [notes, setNotes] = useState<string>(currentScrap.notes);
  const [title, setTitle] = useState<string>(currentScrap.title);
  const [scrapToRender, setScrapToRender] = useState(currentScrap);
  const [isEditMode, setIsEditMode] = useState(!scrapToRender.id);
  const [hasTitleFocus, setHasTitleFocus] = useState(false);

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
    addScrapWrapper?.(
      new ScrapItemWrapper(
        domElementRef,
        currentScrap,
        () => setIsEditMode(!isEditMode),
        upsertScrap,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, isEditMode, currentScrap.editedOn]);

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
        hasTitleFocus,
        setHasTitleFocus,
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
      hasTitleFocus,
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
        id: currentScrap?.id,
        scrapType: currentScrap.scrapType,
        notes: notesToSave,
        title: title,
        journalAttributeValues: {},
        journalId: currentScrap.parentId,
        dateTime: new Date(),
      } as IUpsertScrapsEntryCommand,
    });
  }

  return (
    <ScrapContext.Provider value={contextValue}>
      {children}
    </ScrapContext.Provider>
  );
};
