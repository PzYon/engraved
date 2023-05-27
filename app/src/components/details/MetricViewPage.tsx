import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { useMetricContext } from "./MetricDetailsContext";
import { GroupByTime } from "./chart/consolidation/GroupByTime";
import { IIconButtonAction } from "../common/IconButtonWrapper";
import {
  FilterAltOutlined,
  FunctionsOutlined,
  LocalHotelOutlined,
  MessageOutlined,
  PanToolOutlined,
  ShowChartOutlined,
} from "@mui/icons-material";
import { getCommonActions } from "../overview/getCommonActions";
import { PageSection } from "../layout/pages/PageSection";
import { MetricNotes } from "./edit/MetricNotes";
import { Filters } from "./filters/Filters";
import { Chart } from "./chart/Chart";
import { Thresholds } from "./thresholds/Thresholds";
import { MeasurementsTable } from "./measurementsTable/MeasurementsTable";
import { Route, Routes } from "react-router-dom";
import { EditMeasurementLauncher } from "./edit/EditMeasurementLauncher";
import { DeleteMeasurementLauncher } from "./edit/DeleteMeasurementLauncher";
import { Page } from "../layout/pages/Page";
import { MetricPageTitle } from "./MetricPageTitle";
import { IMetricUiSettings } from "./edit/MetricUiSettings";
import { createDateConditions } from "./filters/createDateConditions";
import { getDefaultDateConditions } from "./filters/DateFilters";
import { GenericEmptyPlaceholder } from "../common/search/GenericEmptyPlaceholder";

export const MetricViewPage: React.FC = () => {
  const { renderDialog } = useDialogContext();

  const {
    metric,
    measurements,
    setSelectedAttributeValues,
    selectedAttributeValues,
    dateConditions,
    setDateConditions,
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

  const [showFilters, setShowFilters] = useState(!!uiSettings?.showFilters);
  const [showChart, setShowChart] = useState(!!uiSettings?.showChart);
  const [showThresholds, setShowThresholds] = useState(
    !!uiSettings?.showThresholds
  );
  const [showGroupTotals, setShowGroupTotals] = useState(
    !!uiSettings?.showGroupTotals
  );

  const [titleActions, setTitleActions] = useState<IIconButtonAction[]>([]);

  useEffect(() => {
    setDateConditions(
      !uiSettings?.dateRange
        ? getDefaultDateConditions()
        : createDateConditions(uiSettings.dateRange, new Date())
    );
  }, [uiSettings?.dateRange]);

  useEffect(() => {
    setTitleActions([
      {
        key: "notes",
        icon: <MessageOutlined fontSize="small" />,
        label: "Show notes",
        onClick: () => setShowNotes(!showNotes),
        isNotActive: !showNotes,
      },
      {
        key: "chart",
        icon: <ShowChartOutlined fontSize="small" />,
        label: "Show chart",
        onClick: () => setShowChart(!showChart),
        isNotActive: !showChart,
      },
      {
        key: "filters",
        icon: <FilterAltOutlined fontSize="small" />,
        label: "Show filters",
        onClick: () => setShowFilters(!showFilters),
        isNotActive: !showFilters,
      },
      {
        key: "groupTotals",
        icon: <FunctionsOutlined fontSize="small" />,
        label: "Show group total",
        onClick: () => setShowGroupTotals(!showGroupTotals),
        isNotActive: !showGroupTotals,
      },
      Object.keys(metric.thresholds || {}).length
        ? {
            key: "thresholds",
            icon: <PanToolOutlined fontSize="small" />,
            label: "Show thresholds",
            onClick: () => setShowThresholds(!showThresholds),
            isNotActive: !showThresholds,
          }
        : undefined,
      null, // null means separator - ugly, but it works for the moment
      ...getCommonActions(metric, renderDialog),
    ]);

    return () => {
      setTitleActions([]);
    };
  }, [
    metric,
    dateConditions,
    selectedAttributeValues,
    showNotes,
    showFilters,
    showChart,
    showThresholds,
    showGroupTotals,
  ]);

  return (
    <Page
      title={<MetricPageTitle metric={metric} />}
      documentTitle={metric.name}
      actions={titleActions}
    >
      {showNotes ? (
        <PageSection>
          <MetricNotes metric={metric} />
        </PageSection>
      ) : null}

      {showFilters ? (
        <PageSection>
          <Filters
            metric={metric}
            groupByTime={groupByTime}
            setGroupByTime={setGroupByTime}
            attributeKey={attributeKey}
            setAttributeKey={setAttributeKey}
            chartType={chartType}
            setChartType={setChartType}
          />
        </PageSection>
      ) : null}

      {showChart && measurements ? (
        <Suspense fallback={<div />}>
          <PageSection>
            <Chart
              measurements={measurements}
              metric={metric}
              groupByTime={groupByTime}
              groupByAttribute={attributeKey}
              chartType={chartType}
            />
          </PageSection>
        </Suspense>
      ) : null}

      {showThresholds && Object.keys(metric.thresholds).length ? (
        <Thresholds
          metric={metric}
          setSelectedAttributeValues={setSelectedAttributeValues}
          selectedAttributeValues={selectedAttributeValues}
        />
      ) : null}

      {measurements?.length ? (
        <PageSection overflowXScroll={true}>
          <MeasurementsTable
            metric={metric}
            measurements={measurements}
            showGroupTotals={showGroupTotals}
          />
        </PageSection>
      ) : measurements ? (
        <GenericEmptyPlaceholder
          icon={LocalHotelOutlined}
          message={"No measurements available."}
        />
      ) : null}

      <Routes>
        <Route
          path="/measurements/:measurementId/edit"
          element={
            <EditMeasurementLauncher
              metric={metric}
              measurements={measurements}
            />
          }
        />
        <Route
          path="/measurements/:measurementId/delete"
          element={<DeleteMeasurementLauncher metric={metric} />}
        />
      </Routes>
    </Page>
  );
};
