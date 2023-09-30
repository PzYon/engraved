import React from "react";
import { Route, Routes } from "react-router-dom";
import { MetricsPage } from "../overview/MetricsPage";
import { MetricPageWrapper } from "../details/MetricPageWrapper";
import { ActivitiesPage } from "../overview/ActivitiesPage";
import { AddMetricPage } from "../overview/AddMetricPage";
import { SearchPage } from "../search/SearchPage";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/metrics/create" element={<AddMetricPage />} />
      <Route path="/metrics" element={<MetricsPage />} />
      <Route path="/" element={<MetricsPage />} />
      <Route path="/metrics/:metricId/*" element={<MetricPageWrapper />} />
      <Route path="/activities" element={<ActivitiesPage />} />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  );
};
