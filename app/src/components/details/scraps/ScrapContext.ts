import { createContext, useContext } from "react";
import { IScrapEntry, ScrapType } from "../../../serverApi/IScrapEntry";
import { IParsedDate } from "../edit/parseDate";
import { IAction } from "../../common/actions/IAction";
import { IJournal } from "../../../serverApi/IJournal";
import { EntryPropsRenderStyle } from "../../common/entries/EntryPropsRenderStyle";
import { IFileRef } from "../../../serverApi/IFileRef";

export type ActionsRenderStyle = "save-only" | "none" | "all";

export interface IScrapContext {
  title: string;
  setTitle: (title: string) => void;
  notes: string | undefined;
  setNotes: (notes: string) => void;
  files: IFileRef[];
  addFile: (file: IFileRef) => void;
  removeFile: (fileId: string) => void;
  date: Date;
  setDate: (date: Date | null) => void;
  parsedDate: IParsedDate | undefined;
  setParsedDate: (parsedDate: IParsedDate | undefined) => void;
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
  isDirty: boolean;
  hasPendingBackgroundUpdate: boolean;
  isAutoSaveEnabled: boolean;
  setIsAutoSaveEnabled: (value: boolean) => void;
  cancelEditingAction: IAction | null;
  upsertScrap: (
    notesToOverride?: string,
    keepEditMode?: boolean,
  ) => Promise<void>;
  scrapToRender: IScrapEntry;
  // The editors only read the scrap when they are created and keep their own state from then on.
  // This changes whenever the scrap is replaced underneath them, so keying them on it makes them
  // start over with the new content. It deliberately does not change when a save of our own comes
  // back, as that would tear down the editor the user is still typing in.
  editorKey: number;
  propsRenderStyle: EntryPropsRenderStyle;
  actionsRenderStyle?: ActionsRenderStyle;
  journal: IJournal;
  onSuccess?: () => void;
  hasFocus: boolean;
  hasTitleFocus: boolean;
  setHasTitleFocus: (value: boolean) => void;
  changeScrapType: (rows: string[], targetType: ScrapType) => void;
}

export const ScrapContext = createContext<IScrapContext>({
  title: null!,
  setTitle: null!,
  notes: null!,
  setNotes: null!,
  files: null!,
  addFile: null!,
  removeFile: null!,
  date: null!,
  setDate: null!,
  parsedDate: null!,
  setParsedDate: null!,
  isEditMode: null!,
  setIsEditMode: null!,
  isDirty: null!,
  hasPendingBackgroundUpdate: null!,
  isAutoSaveEnabled: null!,
  setIsAutoSaveEnabled: null!,
  cancelEditingAction: null!,
  upsertScrap: null!,
  scrapToRender: null!,
  editorKey: null!,
  propsRenderStyle: null!,
  actionsRenderStyle: null!,
  journal: null!,
  onSuccess: null!,
  hasFocus: null!,
  hasTitleFocus: null!,
  setHasTitleFocus: null!,
  changeScrapType: null!,
});

export const useScrapContext = () => {
  return useContext(ScrapContext);
};
