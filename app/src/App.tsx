import React from "react";
import { MetricList } from "./components/MetricList";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MetricDetails } from "./components/MetricDetails";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MetricList />} />
        <Route path="/metrics/:metricKey" element={<MetricDetails />} />
      </Routes>
    </BrowserRouter>
  );
};
