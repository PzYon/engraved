import { useJournalQuery } from "../../serverApi/reactQuery/queries/useJournalQuery";
import { useJournalEntriesQuery } from "../../serverApi/reactQuery/queries/useJournalEntriesQuery";
import { IDateConditions, JournalContext } from "./JournalContext";
import React, { useMemo, useState } from "react";

export const JournalContextProvider: React.FC<{
  children: React.ReactNode;
  journalId: string;
}> = ({ children, journalId }) => {
  const [selectedAttributeValues, setSelectedAttributeValues] = useState<{
    [key: string]: string[];
  }>({});

  const [searchText, setSearchText] = useState<string>(undefined);

  const [dateConditions, setDateConditions] = useState<IDateConditions>({});

  const journal = useJournalQuery(journalId);

  const entries = useJournalEntriesQuery(
    journalId,
    dateConditions,
    selectedAttributeValues,
    searchText,
  );

  const contextValue = useMemo(() => {
    return {
      entries,
      journal,
      toggleAttributeValue: (
        attributeKey: string,
        attributeValueKey: string,
      ) => {
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
      },
      selectedAttributeValues,
      setSelectedAttributeValues: (
        attributeKey: string,
        attributeValueKeys: string[],
      ) => {
        const selectedValues = { ...selectedAttributeValues };
        selectedValues[attributeKey] = attributeValueKeys;
        setSelectedAttributeValues(selectedValues);
      },
      setDateConditions,
      dateConditions,
      searchText,
      setSearchText,
    };
  }, [entries, journal, selectedAttributeValues, dateConditions, searchText]);

  return (
    <JournalContext.Provider value={contextValue}>
      {children}
    </JournalContext.Provider>
  );
};
