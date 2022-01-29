import React from "react";
import { MetricList } from "./components/MetricList";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MetricDetails } from "./components/MetricDetails";
import { PageLayout } from "./components/PageLayout";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <PageLayout>
        <Routes>
          <Route path="/" element={<MetricList />} />
          <Route path="/metrics/:metricKey" element={<MetricDetails />} />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  );
};
