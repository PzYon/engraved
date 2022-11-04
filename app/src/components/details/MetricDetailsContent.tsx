import React, { Suspense, useEffect, useState } from "react";
import { useMetricDetailsContext } from "./MetricDetailsContext";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { useAppContext } from "../../AppContext";
import { Typography } from "@mui/material";
import { EditMeasurementLauncher } from "./edit/EditMeasurementLauncher";
import { DeleteMeasurementLauncher } from "./edit/DeleteMeasurementLauncher";
import { Route, Routes, useNavigate } from "react-router-dom";
import { DetailsSection } from "../layout/DetailsSection";
import { MeasurementsList } from "./dataTable/MeasurementsList";
import { MetricNotes } from "./edit/MetricNotes";
import { getMetricHeaderActions } from "../overview/getMetricHeaderActions";
import { Filters } from "./filters/Filters";
import { GroupByTime } from "./chart/consolidation/GroupByTime";
import { Chart } from "./chart/Chart";
import {
  FilterAltOutlined,
  PanToolOutlined,
  ShowChartOutlined,
} from "@mui/icons-material";
import { Thresholds } from "./thresholds/Thresholds";
import { EditMetric } from "./edit/EditMetric";

export const MetricDetailsContent: React.FC = () => {
  const { metric, measurements, reloadMeasurements, reloadMetric } =
    useMetricDetailsContext();

  const { setTitleActions } = useAppContext();

  const { renderDialog } = useDialogContext();

  const navigate = useNavigate();

  const [groupByTime, setGroupByTime] = useState(GroupByTime.Day);
  const [attributeKey, setAttributeKey] = useState("-");
  const [chartType, setChartType] = useState("bar");

  const [showFilters, setShowFilters] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showThresholds, setShowThresholds] = useState(false);

  useEffect(() => {
    setTitleActions([
      {
        key: "chart",
        icon: <ShowChartOutlined />,
        label: "Show chart",
        onClick: () => setShowChart(!showChart),
        isNotActive: !showChart,
      },
      {
        key: "collapse",
        icon: <FilterAltOutlined />,
        label: "Show filters",
        onClick: () => setShowFilters(!showFilters),
        isNotActive: !showFilters,
      },
      {
        key: "thresholds",
        icon: <PanToolOutlined />,
        label: "Show thresholds",
        onClick: () => setShowThresholds(!showThresholds),
        isNotActive: !showThresholds,
      },
      null, // null means separator - ugly, but it works for the moment
      ...getMetricHeaderActions(metric, renderDialog, () => {
        reloadMeasurements();
        reloadMetric();
      }),
    ]);

    return () => {
      setTitleActions([]);
    };
  }, [metric, showFilters, showChart, showThresholds]);

  if (!metric || !measurements) {
    return null;
  }

  if (!metric) {
    return <Typography>Nothing here.</Typography>;
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <DetailsSection>
                <MetricNotes metric={metric} />
              </DetailsSection>

              {showFilters ? (
                <DetailsSection>
                  <Filters
                    metric={metric}
                    groupByTime={groupByTime}
                    setGroupByTime={setGroupByTime}
                    attributeKey={attributeKey}
                    setAttributeKey={setAttributeKey}
                    chartType={chartType}
                    setChartType={setChartType}
                  />
                </DetailsSection>
              ) : null}

              {showChart ? (
                <Suspense fallback={<div />}>
                  <DetailsSection>
                    <Chart
                      measurements={measurements}
                      metric={metric}
                      groupByTime={groupByTime}
                      groupByAttribute={attributeKey}
                      chartType={chartType}
                    />
                  </DetailsSection>
                </Suspense>
              ) : null}

              {showThresholds ? (
                <DetailsSection>
                  <Thresholds metric={metric} />
                </DetailsSection>
              ) : null}

              <DetailsSection overflowXScroll={true}>
                <MeasurementsList metric={metric} measurements={measurements} />
              </DetailsSection>
            </>
          }
        />
        <Route
          path="/edit"
          element={
            <EditMetric
              metric={metric}
              onSaved={async () => {
                navigate("..");
                await reloadMetric();
              }}
            />
          }
        />
        <Route
          path="/measurements/:measurementId/edit"
          element={
            <EditMeasurementLauncher
              metric={metric}
              measurements={measurements}
              onSaved={reloadMeasurements}
            />
          }
        />
        <Route
          path="/measurements/:measurementId/delete"
          element={
            <DeleteMeasurementLauncher
              metric={metric}
              onDeleted={reloadMeasurements}
            />
          }
        />
      </Routes>
    </>
  );
};
