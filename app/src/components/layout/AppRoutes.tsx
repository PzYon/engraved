import React from "react";
import { Route, Routes } from "react-router-dom";
import { MetricsPage } from "../overview/MetricsPage";
import { MetricPageWrapper } from "../details/MetricPageWrapper";
import { MyPage } from "../users/MyPage";
import { AddMetricPage } from "../overview/AddMetricPage";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/metrics/create" element={<AddMetricPage />} />
      <Route path="/metrics" element={<MetricsPage />} />
      <Route path="/" element={<MetricsPage />} />
      <Route path="/metrics/:metricId/*" element={<MetricPageWrapper />} />
      <Route path="/users/me" element={<MyPage />} />
    </Routes>
  );
};
