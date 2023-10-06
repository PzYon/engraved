import React, { createContext, useContext, useMemo, useState } from "react";
import { IEntry } from "../../serverApi/IEntry";
import { IJournal } from "../../serverApi/IJournal";
import { useJournalQuery } from "../../serverApi/reactQuery/queries/useJournalQuery";
import { useJournalEntriesQuery } from "../../serverApi/reactQuery/queries/useJournalEntriesQuery";

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

const JournalContext = createContext<IJournalContext>({
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

export const JournalContextProvider: React.FC<{
  children: React.ReactNode;
  journalId: string;
}> = ({ children, journalId }) => {
  const [selectedAttributeValues, setSelectedAttributeValues] = useState<{
    [key: string]: string[];
  }>({});

  const [dateConditions, setDateConditions] = useState<IDateConditions>({});

  const journal = useJournalQuery(journalId);

  const entries = useJournalEntriesQuery(
    journalId,
    dateConditions,
    selectedAttributeValues,
  );

  const contextValue = useMemo(() => {
    return {
      entries,
      journal,
      toggleAttributeValue,
      selectedAttributeValues,
      setSelectedAttributeValues: setSelectedAttributeValuesInternal,
      setDateConditions,
      dateConditions,
    };
  }, [entries, journal, selectedAttributeValues, dateConditions]);

  return (
    <JournalContext.Provider value={contextValue}>
      {children}
    </JournalContext.Provider>
  );

  function setSelectedAttributeValuesInternal(
    attributeKey: string,
    attributeValueKeys: string[],
  ) {
    const selectedValues = { ...selectedAttributeValues };
    selectedValues[attributeKey] = attributeValueKeys;
    setSelectedAttributeValues(selectedValues);
  }

  function toggleAttributeValue(
    attributeKey: string,
    attributeValueKey: string,
  ) {
    const selectedValues = { ...selectedAttributeValues };

    if (!selectedValues[attributeKey]) {
      selectedValues[attributeKey] = [];
    }

    const index = selectedValues[attributeKey].indexOf(attributeValueKey);
    if (index > -1) {
      selectedValues[attributeKey].splice(index);
    } else {
      selectedValues[attributeKey].push(attributeValueKey);
    }

    setSelectedAttributeValues(selectedValues);
  }
};
