import React from "react";
import { usePageContext } from "../../layout/pages/PageContext";
import { JournalTypeSelector } from "../../JournalTypeSelector";
import { JournalType } from "../../../serverApi/JournalType";

export const PageJournalTypesSelector: React.FC = () => {
  const { journalTypes, setJournalTypes } = usePageContext();

  return (
    <JournalTypeSelector
      margin="dense"
      allowMultiple={true}
      journalType={journalTypes}
      onChange={(types: JournalType | JournalType[]) =>
        setJournalTypes(types as JournalType[])
      }
    />
  );
};
