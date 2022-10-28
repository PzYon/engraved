import React, { Suspense, useEffect, useState } from "react";
import { useMetricDetailsContext } from "./MetricDetailsContext";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { useAppContext } from "../../AppContext";
import { Typography } from "@mui/material";
import { EditMeasurementLauncher } from "./edit/EditMeasurementLauncher";
import { DeleteMeasurementLauncher } from "./edit/DeleteMeasurementLauncher";
import { Route, Routes } from "react-router-dom";
import { DetailsSection } from "../layout/DetailsSection";
import { MeasurementsList } from "./dataTable/MeasurementsList";
import { MetricNotes } from "./edit/MetricNotes";
import { getMetricHeaderActions } from "../overview/getMetricHeaderActions";
import { Filters } from "./filters/Filters";
import { GroupByTime } from "./chart/consolidation/GroupByTime";
import { Chart } from "./chart/Chart";
import { FilterAltOutlined, ShowChartOutlined } from "@mui/icons-material";
import { EditMetricLauncher } from "./edit/EditMetricLauncher";

export const MetricDetailsContent: React.FC = () => {
  const { metric, measurements, reloadMeasurements, reloadMetric } =
    useMetricDetailsContext();

  const { setTitleActions } = useAppContext();

  const { renderDialog } = useDialogContext();

  const [groupByTime, setGroupByTime] = useState(GroupByTime.Day);
  const [attributeKey, setAttributeKey] = useState("-");
  const [chartType, setChartType] = useState("bar");

  const [showFilters, setShowFilters] = useState(false);
  const [showChart, setShowChart] = useState(false);

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
      null, // null means separator - ugly, but it works for the moment
      ...getMetricHeaderActions(metric, renderDialog, () => {
        reloadMeasurements();
        reloadMetric();
      }),
    ]);

    return () => {
      setTitleActions([]);
    };
  }, [metric, showFilters, showChart]);

  if (!metric || !measurements) {
    return null;
  }

  if (!metric) {
    return <Typography>Nothing here.</Typography>;
  }

  return (
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

      <DetailsSection overflowXScroll={true}>
        <MeasurementsList metric={metric} measurements={measurements} />
      </DetailsSection>

      <Routes>
        <Route
          path="/edit"
          element={
            <EditMetricLauncher metric={metric} reloadMetric={reloadMetric} />
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
