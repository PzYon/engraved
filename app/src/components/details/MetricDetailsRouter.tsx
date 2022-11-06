import React from "react";
import { Route, Routes } from "react-router-dom";
import { MetricEditPage } from "./edit/MetricEditPage";
import { MetricViewPage } from "./MetricViewPage";

export const MetricDetailsRouter: React.FC = () => (
  <Routes>
    <Route path="/" element={<MetricViewPage />} />
    <Route path="/edit" element={<MetricEditPage />} />
  </Routes>
);
