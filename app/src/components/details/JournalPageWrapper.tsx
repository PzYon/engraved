import React from "react";
import { getRouteApi } from "@tanstack/react-router";
import { JournalDetails } from "./JournalDetails";
import { JournalContextProvider } from "./JournalContextProvider";

const routeApi = getRouteApi("/journals/details/$journalId");

export const JournalPageWrapper: React.FC = () => {
  const { journalId } = routeApi.useParams();

  return (
    <JournalContextProvider journalId={journalId}>
      <JournalDetails />
    </JournalContextProvider>
  );
};
