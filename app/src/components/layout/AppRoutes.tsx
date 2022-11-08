import React from "react";
import { Route, Routes } from "react-router-dom";
import { MetricsPage } from "../overview/MetricsPage";
import { MetricPageWrapper } from "../details/MetricPageWrapper";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/metrics/create"
        element={<MetricsPage showCreate={true} />}
      />
      <Route path="/metrics" element={<MetricsPage />} />
      <Route path="/" element={<MetricsPage />} />
      <Route path="/metrics/:metricId/*" element={<MetricPageWrapper />} />
    </Routes>
  );
};
