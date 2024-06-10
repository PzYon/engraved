import { createContext, useContext } from "react";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { EntryPropsRenderStyle } from "../../common/entries/Entry";
import { IParsedDate } from "../edit/parseDate";
import { IAction } from "../../common/actions/IAction";
import { IJournal } from "../../../serverApi/IJournal";

export type ActionsRenderStyle = "save-only" | "none" | "all";

export interface IScrapContext {
  title: string;
  setTitle: (title: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
  parsedDate: IParsedDate;
  setParsedDate: (parsedDate: IParsedDate) => void;
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
  isDirty: boolean;
  cancelEditingAction: IAction;
  upsertScrap: (notesToOverride?: string) => Promise<void>;
  scrapToRender: IScrapEntry;
  propsRenderStyle: EntryPropsRenderStyle;
  actionsRenderStyle?: ActionsRenderStyle;
  journal: IJournal;
  onSuccess?: () => void;
  hasFocus: boolean;
  giveFocus?: () => void;
  hasTitleFocus: boolean;
  setHasTitleFocus: (value: boolean) => void;
}

export const ScrapContext = createContext<IScrapContext>({
  title: null,
  setTitle: null,
  notes: null,
  setNotes: null,
  parsedDate: null,
  setParsedDate: null,
  isEditMode: null,
  setIsEditMode: null,
  isDirty: null,
  cancelEditingAction: null,
  upsertScrap: null,
  scrapToRender: null,
  propsRenderStyle: null,
  actionsRenderStyle: null,
  journal: null,
  onSuccess: null,
  hasFocus: null,
  giveFocus: null,
  hasTitleFocus: null,
  setHasTitleFocus: null,
});

export const useScrapContext = () => {
  return useContext(ScrapContext);
};
