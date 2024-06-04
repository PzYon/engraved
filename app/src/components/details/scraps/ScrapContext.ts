import { createContext, useContext } from "react";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { EntryPropsRenderStyle } from "../../common/entries/Entry";
import { IParsedDate } from "../edit/parseDate";

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
  getCancelEditingFunction: () => () => void;
  upsertScrap: (notesToOverride?: string) => Promise<void>;
  scrapToRender: IScrapEntry;
  propsRenderStyle: EntryPropsRenderStyle;
  actionsRenderStyle?: ActionsRenderStyle;
  journalName: string;
  onSuccess?: () => void;
  hasFocus: boolean;
  giveFocus?: () => void;
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
  getCancelEditingFunction: null,
  upsertScrap: null,
  scrapToRender: null,
  propsRenderStyle: null,
  actionsRenderStyle: null,
  journalName: null,
  onSuccess: null,
  hasFocus: null,
  giveFocus: null,
});

export const useScrapContext = () => {
  return useContext(ScrapContext);
};
