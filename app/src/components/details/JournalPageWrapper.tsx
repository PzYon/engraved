import React from "react";
import { useParams } from "react-router";
import { JournalContextProvider } from "./JournalDetailsContext";
import { JournalDetails } from "./JournalDetails";

export const JournalPageWrapper: React.FC = () => {
  const { journalId } = useParams();

  return (
    <JournalContextProvider journalId={journalId}>
      <JournalDetails />
    </JournalContextProvider>
  );
};
