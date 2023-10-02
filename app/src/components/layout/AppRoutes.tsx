import React from "react";
import { Route, Routes } from "react-router-dom";
import { JournalsPage } from "../overview/JournalsPage";
import { JournalPageWrapper } from "../details/JournalPageWrapper";
import { ActivitiesPage } from "../overview/ActivitiesPage";
import { AddJournalPage } from "../overview/AddJournalPage";
import { SearchPage } from "../search/SearchPage";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/journals/create" element={<AddJournalPage />} />
      <Route path="/journals" element={<JournalsPage />} />
      <Route path="/" element={<JournalsPage />} />
      <Route path="/journals/:metricId/*" element={<JournalPageWrapper />} />
      <Route path="/activities" element={<ActivitiesPage />} />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  );
};
