import React, { Suspense } from "react";
import { useParams } from "react-router";
import { JournalDetails } from "./JournalDetails";
import { JournalContextProvider } from "./JournalContextProvider";
import { CircularProgress } from "@mui/material";

export const JournalPageWrapper: React.FC = () => {
  const { journalId } = useParams();

  return (
    // Suspense is used here so that a loading indicator is shown while the
    // journal data fetches, instead of rendering nothing (blank screen).
    <Suspense fallback={<CircularProgress />}>
      <JournalContextProvider journalId={journalId}>
        <JournalDetails />
      </JournalContextProvider>
    </Suspense>
  );
};
