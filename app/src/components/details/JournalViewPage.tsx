import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { useJournalContext } from "./JournalDetailsContext";
import { LocalHotelOutlined } from "@mui/icons-material";
import { getCommonActions } from "../overview/getCommonActions";
import { PageSection } from "../layout/pages/PageSection";
import { JournalNotes } from "./edit/JournalNotes";
import { EntryFilters } from "./filters/EntryFilters";
import { Thresholds } from "./thresholds/Thresholds";
import { EntriesTable } from "./entriesTable/EntriesTable";
import { Route, Routes } from "react-router-dom";
import { EditEntryLauncher } from "./edit/EditEntryLauncher";
import { DeleteEntryLauncher } from "./edit/DeleteEntryLauncher";
import { Page } from "../layout/pages/Page";
import { JournalPageTitle } from "./JournalPageTitle";
import { IJournalUiSettings } from "./edit/JournalUiSettings";
import { createDateConditions } from "./filters/createDateConditions";
import { getDefaultDateConditions } from "./filters/DateFilters";
import { GenericEmptyPlaceholder } from "../common/search/GenericEmptyPlaceholder";
import { MyChartType } from "./chart/grouping/ChartTypeSelector";
import { ActionFactory } from "../common/actions/ActionFactory";
import { IAction } from "../common/actions/IAction";
import { journalDefaultUiSettings } from "./journalDefaultUiSettings";
import { JournalType } from "../../serverApi/JournalType";
import { DeviceWidth, useDeviceWidth } from "../common/useDeviceWidth";
import { Chart } from "./chart/Chart";

export const JournalViewPage: React.FC = () => {
  const { renderDialog } = useDialogContext();
  const deviceWidth = useDeviceWidth();

  const {
    journal,
    entries,
    setSelectedAttributeValues,
    selectedAttributeValues,
    dateConditions,
    setDateConditions,
  } = useJournalContext();

  const uiSettings = useMemo<IJournalUiSettings>(
    () =>
      journal.customProps?.uiSettings
        ? JSON.parse(journal.customProps.uiSettings)
        : {},
    [journal?.customProps?.uiSettings],
  );

  const [groupByTime, setGroupByTime] = useState(
    uiSettings?.groupByTime ?? journalDefaultUiSettings.groupByTime,
  );
  const [attributeKey, setAttributeKey] = useState("-");
  const [chartType, setChartType] = useState<MyChartType>(
    uiSettings.chartType ?? journalDefaultUiSettings.chartType,
  );

  const [showNotes, setShowNotes] = useState(!!journal.notes);

  const [showAddNewEntryRow, setShowAddNewEntryRow] = useState(false);

  const [showFilters, setShowFilters] = useState(!!uiSettings?.showFilters);
  const [showChart, setShowChart] = useState(!!uiSettings?.showChart);
  const [showThresholds, setShowThresholds] = useState(
    !!uiSettings?.showThresholds,
  );
  const [showGroupTotals, setShowGroupTotals] = useState(
    !!uiSettings?.showGroupTotals,
  );

  const [titleActions, setTitleActions] = useState<IAction[]>([]);

  useEffect(() => {
    setDateConditions(
      !uiSettings?.dateRange
        ? getDefaultDateConditions()
        : createDateConditions(uiSettings.dateRange, new Date()),
    );
  }, [setDateConditions, uiSettings.dateRange]);

  useEffect(() => {
    setTitleActions([
      deviceWidth !== DeviceWidth.Small
        ? ActionFactory.toggleAddNewEntryRow(
            showAddNewEntryRow,
            setShowAddNewEntryRow,
          )
        : undefined,
      ActionFactory.toggleNotes(showNotes, setShowNotes),
      ActionFactory.toggleShowChart(showChart, setShowChart),
      ActionFactory.toggleFilters(showFilters, setShowFilters, false),
      ActionFactory.toggleGroupTotals(showGroupTotals, setShowGroupTotals),
      Object.keys(journal.thresholds || {}).length
        ? ActionFactory.toggleThresholds(showThresholds, setShowThresholds)
        : undefined,
      null, // null means separator - ugly, but it works for the moment
      ...getCommonActions(journal, true, renderDialog),
    ]);

    return () => {
      setTitleActions([]);
    };
  }, [
    journal,
    dateConditions,
    selectedAttributeValues,
    showAddNewEntryRow,
    showNotes,
    showFilters,
    showChart,
    deviceWidth,
    showThresholds,
    showGroupTotals,
    renderDialog,
  ]);

  return (
    <Page
      title={<JournalPageTitle journal={journal} />}
      documentTitle={journal.name}
      actions={titleActions}
    >
      {showNotes ? (
        <PageSection>
          <JournalNotes journal={journal} />
        </PageSection>
      ) : null}

      {showFilters ? (
        <PageSection>
          <EntryFilters
            journal={journal}
            groupByTime={groupByTime}
            setGroupByTime={setGroupByTime}
            attributeKey={attributeKey}
            setAttributeKey={setAttributeKey}
            chartType={chartType}
            setChartType={setChartType}
          />
        </PageSection>
      ) : null}

      {showChart && entries ? (
        <Suspense fallback={<div />}>
          <PageSection>
            <Chart
              entries={entries}
              journal={journal}
              groupByTime={groupByTime}
              groupByAttribute={attributeKey}
              chartType={chartType}
              chartUiProps={{}}
            />
          </PageSection>
        </Suspense>
      ) : null}

      {showThresholds && Object.keys(journal.thresholds).length ? (
        <Thresholds
          journal={journal}
          setSelectedAttributeValues={setSelectedAttributeValues}
          selectedAttributeValues={selectedAttributeValues}
        />
      ) : null}

      {entries?.length ? (
        <PageSection overflowXScroll={true}>
          <EntriesTable
            journal={journal}
            entries={entries}
            showGroupTotals={showGroupTotals}
            showAddNewEntryRow={
              showAddNewEntryRow &&
              (journal.type === JournalType.Gauge ||
                journal.type === JournalType.Counter)
            }
          />
        </PageSection>
      ) : entries ? (
        <GenericEmptyPlaceholder
          icon={LocalHotelOutlined}
          message={"No entries available."}
        />
      ) : null}

      <Routes>
        <Route
          path="/entries/:entryId/edit"
          element={<EditEntryLauncher journal={journal} entries={entries} />}
        />
        <Route
          path="/entries/:entryId/delete"
          element={<DeleteEntryLauncher journal={journal} />}
        />
      </Routes>
    </Page>
  );
};
