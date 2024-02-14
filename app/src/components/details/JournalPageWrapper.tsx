import React from "react";
import { useParams } from "react-router";
import { JournalDetails } from "./JournalDetails";
import { JournalContextProvider } from "./JournalContextProvider";

export const JournalPageWrapper: React.FC = () => {
  const { journalId } = useParams();

  return (
    <JournalContextProvider journalId={journalId}>
      <JournalDetails />
    </JournalContextProvider>
  );
};
