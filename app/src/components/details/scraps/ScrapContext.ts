import { createContext, useContext } from "react";
import { IScrapEntry, ScrapType } from "../../../serverApi/IScrapEntry";
import { EntryPropsRenderStyle } from "../../common/entries/Entry";
import { IParsedDate } from "../edit/parseDate";
import { IAction } from "../../common/actions/IAction";
import { IJournal } from "../../../serverApi/IJournal";

export type ActionsRenderStyle = "save-only" | "none" | "all";

export interface IScrapContext {
  title: string;
  setTitle: (title: string) => void;
  notes: string | undefined;
  setNotes: (notes: string) => void;
  date: Date;
  setDate: (date: Date | null) => void;
  parsedDate: IParsedDate | undefined;
  setParsedDate: (parsedDate: IParsedDate | undefined) => void;
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
  isDirty: boolean;
  hasPendingBackgroundUpdate: boolean;
  cancelEditingAction: IAction | null;
  upsertScrap: (
    notesToOverride?: string,
    keepEditMode?: boolean,
  ) => Promise<void>;
  scrapToRender: IScrapEntry;
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
  date: null!,
  setDate: null!,
  parsedDate: null!,
  setParsedDate: null!,
  isEditMode: null!,
  setIsEditMode: null!,
  isDirty: null!,
  hasPendingBackgroundUpdate: null!,
  cancelEditingAction: null!,
  upsertScrap: null!,
  scrapToRender: null!,
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
