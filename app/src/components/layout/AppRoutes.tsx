import React from "react";
import { Route, Routes } from "react-router-dom";
import { EntriesPage } from "../overview/entries/EntriesPage";
import { SearchPage } from "../overview/search/SearchPage";
import { ScheduledPage } from "../overview/scheduled/ScheduledPage";
import { PwaSettingsPage } from "../../pwa/PwaSettingsPage";
import { JournalsPage } from "../overview/journals/JournalsPage";
import { JournalPageWrapper } from "../details/JournalPageWrapper";
import { AddJournalPage } from "../overview/AddJournalPage";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/journals/create" element={<AddJournalPage />} />
      <Route
        path="/journals/details/:journalId/*"
        element={<JournalPageWrapper />}
      />
      <Route path="/journals/*" element={<JournalsPage />} />
      <Route path="/entries/*" element={<EntriesPage />} />
      <Route path="/search/*" element={<SearchPage />} />
      <Route path="/scheduled/*" element={<ScheduledPage />} />
      <Route path="/settings" element={<PwaSettingsPage />} />
      <Route path="/*" element={<JournalsPage />} />
    </Routes>
  );
};
