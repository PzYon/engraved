import React from "react";
import { MetricList } from "./components/overview/MetricList";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { MetricDetails } from "./components/details/MetricDetails";
import { AddMetric } from "./components/AddMetric";
import { Typography } from "@mui/material";
import { PageHeader } from "./components/layout/PageHeader";

export const App: React.FC = () => (
  <BrowserRouter>
    <PageHeader>
      <Link to="/">
        <Typography variant="h2">metrix</Typography>
      </Link>
    </PageHeader>
    <Routes>
      <Route path="/" element={<MetricList />} />
      <Route path="/metrics/create" element={<AddMetric />} />
      <Route path="/metrics/view/:metricKey/*" element={<MetricDetails />} />
    </Routes>
  </BrowserRouter>
);
