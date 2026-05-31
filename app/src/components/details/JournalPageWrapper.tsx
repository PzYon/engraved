import React from "react";
import { useParams } from "@tanstack/react-router";
import { JournalDetails } from "./JournalDetails";
import { JournalContextProvider } from "./JournalContextProvider";

export const JournalPageWrapper: React.FC = () => {
  const { journalId } = useParams({ strict: false });

  return (
    <JournalContextProvider journalId={journalId}>
      <JournalDetails />
    </JournalContextProvider>
  );
};
