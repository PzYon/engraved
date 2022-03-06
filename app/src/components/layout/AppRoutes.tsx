import React from "react";
import { Route, Routes } from "react-router-dom";
import { MetricList } from "../overview/MetricList";
import { AddMetric } from "../AddMetric";
import { MetricDetails } from "../details/MetricDetails";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MetricList />} />
      <Route path="/metrics/create" element={<AddMetric />} />
      <Route path="/metrics/view/:metricKey/*" element={<MetricDetails />} />
    </Routes>
  );
};
