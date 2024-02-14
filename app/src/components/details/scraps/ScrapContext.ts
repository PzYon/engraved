import { createContext, useContext } from "react";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
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

export const ScrapContext = createContext<IScrapContext>({
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
