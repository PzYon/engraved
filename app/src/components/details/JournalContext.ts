import { createContext, useContext } from "react";
import { IEntry } from "../../serverApi/IEntry";
import { IJournal } from "../../serverApi/IJournal";

export interface IDateConditions {
  from?: Date;
  to?: Date;
}

export interface IJournalContext {
  journal: IJournal;
  entries: IEntry[];
  toggleAttributeValue: (
    attributeKey: string,
    attributeValueKey: string,
  ) => void;
  setSelectedAttributeValues: (
    attributeKey: string,
    attributeValueKeys: string[],
  ) => void;
  selectedAttributeValues: Record<string, string[]>;
  setDateConditions: (conditions: IDateConditions) => void;
  dateConditions: IDateConditions;
}

export const JournalContext = createContext<IJournalContext>({
  journal: null,
  entries: [],
  toggleAttributeValue: null,
  setSelectedAttributeValues: null,
  selectedAttributeValues: {},
  setDateConditions: null,
  dateConditions: {},
});

export const useJournalContext = () => {
  return useContext(JournalContext);
};
