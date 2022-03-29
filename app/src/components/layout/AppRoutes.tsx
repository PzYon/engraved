import React from "react";
import { Route, Routes } from "react-router-dom";
import { MetricList } from "../overview/MetricList";
import { MetricDetails } from "../details/MetricDetails";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/metrics/create"
        element={<MetricList showCreate={true} />}
      />
      <Route path="/metrics" element={<MetricList />} />
      <Route path="/" element={<MetricList />} />
      <Route path="/metrics/:metricKey/*" element={<MetricDetails />} />
    </Routes>
  );
};
