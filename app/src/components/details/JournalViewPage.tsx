import { useJournalViewState } from "./useJournalViewState";
import React, { useEffect } from "react";
import { useJournalContext } from "./JournalContext";
import { getCommonJournalActions } from "../overview/getCommonJournalActions";
import { PageSection } from "../layout/pages/PageSection";
import { JournalNotes } from "./edit/JournalNotes";
import { JournalViewFilters } from "./JournalViewFilters";
import { FooterRowMode } from "./edit/IJournalUiSettings";
import { JournalViewEntries } from "./JournalViewEntries";
import { Page } from "../layout/pages/Page";
import { JournalPageTitle } from "./JournalPageTitle";
import { createDateConditions } from "./filters/createDateConditions";
import { useIsOffline } from "../common/useIsOffline";
import { ActionFactory } from "../common/actions/ActionFactory";
import { IAction } from "../common/actions/IAction";
import { DeviceWidth, useDeviceWidth } from "../common/useDeviceWidth";
import { JournalViewChart } from "./JournalViewChart";
import { useAppContext } from "../../AppContext";
import { JournalSubRoutes } from "../overview/journals/JournalSubRoutes";
import { isEntryFilterApplied } from "./filters/isEntryFilterApplied";

// fallow-ignore-next-line complexity
export const JournalViewPage: React.FC = () => {
  const deviceWidth = useDeviceWidth();
  const { user } = useAppContext();
  const isOffline = useIsOffline();

  const {
    journal,
    entries,
    setSelectedAttributeValues,
    selectedAttributeValues,
    dateConditions,
    setDateConditions,
    searchText,
  } = useJournalContext();

  const {
    groupByTime,
    setGroupByTime,
    attributeKey,
    setAttributeKey,
    chartType,
    setChartType,
    showNotes,
    setShowNotes,
    showAddNewEntryRow,
    setShowAddNewEntryRow,
    showFilters,
    setShowFilters,
    showChart,
    setShowChart,
    showAgenda,
    setShowAgenda,
    aggregationMode,
    setAggregationMode,
    showThresholds,
    setShowThresholds,
    showGroupTotals,
    setShowGroupTotals,
    dateFilter,
    footerRowMode,
  } = useJournalViewState();

  const showStreak = !isEntryFilterApplied(
    dateConditions,
    selectedAttributeValues,
    searchText,
  );

  const dateFilterHash = JSON.stringify(dateFilter);

  useEffect(() => {
    setDateConditions(createDateConditions(dateFilter, new Date()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDateConditions, dateFilterHash]);

  const titleActions = getTitleActions();

  return (
    <Page
      title={<JournalPageTitle journal={journal} />}
      documentTitle={journal.name ?? ""}
      actions={titleActions}
      pageActionRoutes={<JournalSubRoutes journal={journal} />}
    >
      {showNotes ? (
        <PageSection>
          <JournalNotes journal={journal} />
        </PageSection>
      ) : null}

      {showFilters ? (
        <JournalViewFilters
          journal={journal}
          groupByTime={groupByTime}
          setGroupByTime={setGroupByTime}
          attributeKey={attributeKey}
          setAttributeKey={setAttributeKey}
          chartType={chartType}
          setChartType={setChartType}
          dateFilter={dateFilter}
        />
      ) : null}

      {showChart && entries ? (
        <JournalViewChart
          entries={entries}
          dateConditions={dateConditions}
          journal={journal}
          groupByTime={groupByTime}
          attributeKey={attributeKey}
          chartType={chartType}
          aggregationMode={aggregationMode}
        />
      ) : null}

      <JournalViewEntries
        journal={journal}
        entries={entries}
        showThresholds={showThresholds}
        dateConditions={dateConditions}
        setSelectedAttributeValues={setSelectedAttributeValues}
        selectedAttributeValues={selectedAttributeValues}
        showAgenda={showAgenda}
        showStreak={showStreak}
        showGroupTotals={showGroupTotals}
        showAddNewEntryRow={showAddNewEntryRow}
        aggregationMode={aggregationMode}
        setAggregationMode={setAggregationMode}
        footerRowMode={footerRowMode as FooterRowMode}
        isOffline={isOffline}
      />
    </Page>
  );

  function getTitleActions() {
    return [
      ActionFactory.toggleAgendaView(showAgenda, setShowAgenda),
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
      Object.keys(journal.thresholds ?? {}).length
        ? ActionFactory.toggleThresholds(showThresholds, setShowThresholds)
        : undefined,
      ...getCommonJournalActions(journal, true, user),
    ].filter((a): a is IAction => a != null);
  }
};
