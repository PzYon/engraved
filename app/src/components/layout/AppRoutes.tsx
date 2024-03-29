import React from "react";
import { Route, Routes } from "react-router-dom";
import { JournalsPage } from "../overview/JournalsPage";
import { JournalPageWrapper } from "../details/JournalPageWrapper";
import { EntriesPage } from "../overview/EntriesPage";
import { AddJournalPage } from "../overview/AddJournalPage";
import { SearchPage } from "../search/SearchPage";
import { ScheduledPage } from "../scheduled/ScheduledPage";
import { PwaSettingsPage } from "../../pwa/PwaSettingsPage";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/journals/create" element={<AddJournalPage />} />
      <Route path="/journals" element={<JournalsPage />} />
      <Route path="/" element={<JournalsPage />} />
      <Route path="/journals/:journalId/*" element={<JournalPageWrapper />} />
      <Route path="/entries" element={<EntriesPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/scheduled" element={<ScheduledPage />} />
      <Route path="/settings" element={<PwaSettingsPage />} />
    </Routes>
  );
};
