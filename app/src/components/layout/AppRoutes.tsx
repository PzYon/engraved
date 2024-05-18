import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { JournalsPage } from "../overview/journals/JournalsPage";
import { JournalPageWrapper } from "../details/JournalPageWrapper";
import { EntriesPage } from "../overview/entries/EntriesPage";
import { AddJournalPage } from "../overview/AddJournalPage";
import { SearchPage } from "../overview/search/SearchPage";
import { ScheduledPage } from "../overview/scheduled/ScheduledPage";
import { PwaSettingsPage } from "../../pwa/PwaSettingsPage";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Navigate replace to="/journals" />} />
      <Route path="/journals/actions/*" element={<JournalsPage />} />
      <Route path="/journals/create" element={<AddJournalPage />} />
      <Route path="/journals/:journalId/*" element={<JournalPageWrapper />} />
      <Route path="/journals/*" element={<JournalsPage />} />
      <Route path="/entries/*" element={<EntriesPage />} />
      <Route path="/search/*" element={<SearchPage />} />
      <Route path="/scheduled/*" element={<ScheduledPage />} />
      <Route path="/settings" element={<PwaSettingsPage />} />
    </Routes>
  );
};
