import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { useMetricContext } from "./MetricDetailsContext";
import { GroupByTime } from "./chart/consolidation/GroupByTime";
import { IIconButtonAction } from "../common/IconButtonWrapper";
import {
  FilterAltOutlined,
  MessageOutlined,
  PanToolOutlined,
  ShowChartOutlined,
} from "@mui/icons-material";
import { getCommonActions } from "../overview/getCommonActions";
import { DetailsSection } from "../layout/DetailsSection";
import { MetricNotes } from "./edit/MetricNotes";
import { Filters } from "./filters/Filters";
import { Chart } from "./chart/Chart";
import { Thresholds } from "./thresholds/Thresholds";
import { MeasurementsList } from "./dataTable/MeasurementsList";
import { Route, Routes } from "react-router-dom";
import { EditMeasurementLauncher } from "./edit/EditMeasurementLauncher";
import { DeleteMeasurementLauncher } from "./edit/DeleteMeasurementLauncher";
import { Page } from "../layout/pages/Page";
import { PageTitle } from "./PageTitle";
import { IMetricUiSettings } from "./edit/MetricUiSettings";

export const MetricViewPage: React.FC = () => {
  const { renderDialog } = useDialogContext();

  const {
    metric,
    reloadMetric,
    measurements,
    reloadMeasurements,
    setSelectedAttributeValues,
    selectedAttributeValues,
  } = useMetricContext();

  const uiSettings = useMemo<IMetricUiSettings>(
    () =>
      metric.customProps?.uiSettings
        ? JSON.parse(metric.customProps.uiSettings)
        : {},
    [metric?.customProps?.uiSettings]
  );

  const [groupByTime, setGroupByTime] = useState(
    uiSettings?.groupByTime ?? GroupByTime.Day
  );
  const [attributeKey, setAttributeKey] = useState("-");
  const [chartType, setChartType] = useState("bar");

  const [showNotes, setShowNotes] = useState(!!metric.notes);
  const [showFilters, setShowFilters] = useState(false);

  const [showChart, setShowChart] = useState(!!uiSettings?.showChart);
  const [showThresholds, setShowThresholds] = useState(
    !!uiSettings?.showThresholds
  );

  const [titleActions, setTitleActions] = useState<IIconButtonAction[]>([]);

  const [reloadToken, setReloadToken] = useState(Math.random());

  useEffect(() => {
    setTitleActions([
      {
        key: "notes",
        icon: <MessageOutlined />,
        label: "Show notes",
        onClick: () => setShowNotes(!showNotes),
        isNotActive: !showNotes,
      },
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
      ...getCommonActions(metric, renderDialog, reload),
    ]);

    return () => {
      setTitleActions([]);
    };
  }, [metric, showNotes, showFilters, showChart, showThresholds]);

  return (
    <Page title={<PageTitle metric={metric} />} actions={titleActions}>
      {showNotes ? (
        <DetailsSection>
          <MetricNotes metric={metric} />
        </DetailsSection>
      ) : null}

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

      {showChart && measurements ? (
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
        <Thresholds
          reloadToken={reloadToken}
          metric={metric}
          setSelectedAttributeValues={setSelectedAttributeValues}
          selectedAttributeValues={selectedAttributeValues}
        />
      ) : null}

      <DetailsSection overflowXScroll={true}>
        <MeasurementsList metric={metric} measurements={measurements} />
      </DetailsSection>

      <Routes>
        <Route
          path="/measurements/:measurementId/edit"
          element={
            <EditMeasurementLauncher
              metric={metric}
              measurements={measurements}
              onSaved={reload}
            />
          }
        />
        <Route
          path="/measurements/:measurementId/delete"
          element={
            <DeleteMeasurementLauncher metric={metric} onDeleted={reload} />
          }
        />
      </Routes>
    </Page>
  );

  async function reload(): Promise<void> {
    setReloadToken(Math.random());
    await Promise.all([reloadMetric(), reloadMeasurements()]);
  }
};
