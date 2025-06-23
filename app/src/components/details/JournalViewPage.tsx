import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useJournalContext } from "./JournalContext";
import { LocalHotelOutlined } from "@mui/icons-material";
import { getCommonJournalActions } from "../overview/getCommonJournalActions";
import { PageSection } from "../layout/pages/PageSection";
import { JournalNotes } from "./edit/JournalNotes";
import { EntryFilters } from "./filters/EntryFilters";
import { Thresholds } from "./thresholds/Thresholds";
import { EntriesTable } from "./entriesTable/EntriesTable";
import { Page } from "../layout/pages/Page";
import { JournalPageTitle } from "./JournalPageTitle";
import { createDateConditions } from "./filters/createDateConditions";
import { GenericEmptyPlaceholder } from "../common/search/GenericEmptyPlaceholder";
import { MyChartType } from "./chart/grouping/ChartTypeSelector";
import { ActionFactory } from "../common/actions/ActionFactory";
import { IAction } from "../common/actions/IAction";
import { journalDefaultUiSettings } from "./journalDefaultUiSettings";
import { JournalType } from "../../serverApi/JournalType";
import { DeviceWidth, useDeviceWidth } from "../common/useDeviceWidth";
import { Chart } from "./chart/Chart";
import { IJournalUiSettings } from "./edit/IJournalUiSettings";
import { getUiSettings } from "../../util/journalUtils";
import { useAppContext } from "../../AppContext";
import { JournalSubRoutes } from "../overview/journals/JournalSubRoutes";
import { EntriesAgenda } from "./entriesAgenda/EntriesAgenda";

export const JournalViewPage: React.FC = () => {
  const deviceWidth = useDeviceWidth();
  const { user } = useAppContext();

  const {
    journal,
    entries,
    setSelectedAttributeValues,
    selectedAttributeValues,
    dateConditions,
    setDateConditions,
  } = useJournalContext();

  const uiSettings = useMemo<IJournalUiSettings>(
    () => getUiSettings(journal),
    [journal],
  );

  const [groupByTime, setGroupByTime] = useState(
    uiSettings?.groupByTime ?? journalDefaultUiSettings.groupByTime,
  );
  const [attributeKey, setAttributeKey] = useState("-");
  const [chartType, setChartType] = useState<MyChartType>(
    uiSettings.chartType ?? journalDefaultUiSettings.chartType,
  );

  const [showNotes, setShowNotes] = useState(!!journal.notes);

  const [showAddNewEntryRow, setShowAddNewEntryRow] = useState(
    isTypeThatCanShowAddEntryRow(),
  );

  const [showFilters, setShowFilters] = useState(!!uiSettings?.showFilters);
  const [showChart, setShowChart] = useState(!!uiSettings?.showChart);
  const [showAgenda, setShowAgenda] = useState(!!uiSettings?.showAgenda);

  const [showThresholds, setShowThresholds] = useState(
    !!uiSettings?.showThresholds,
  );
  const [showGroupTotals, setShowGroupTotals] = useState(
    !!uiSettings?.showGroupTotals,
  );

  const [titleActions, setTitleActions] = useState<IAction[]>([]);

  const dateFilter =
    uiSettings.dateFilter ?? journalDefaultUiSettings.dateFilter;

  const dateFilterHash = JSON.stringify(dateFilter);

  useEffect(() => {
    setDateConditions(createDateConditions(dateFilter, new Date()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDateConditions, dateFilterHash]);

  useEffect(() => {
    setTitleActions([
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
      Object.keys(journal.thresholds || {}).length
        ? ActionFactory.toggleThresholds(showThresholds, setShowThresholds)
        : undefined,
      null, // null means separator - ugly, but it works for the moment
      ...getCommonJournalActions(journal, true, user),
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
    showAgenda,
    deviceWidth,
    showThresholds,
    showGroupTotals,
    user,
  ]);

  function isTypeThatCanShowAddEntryRow() {
    return (
      journal.type === JournalType.Gauge || journal.type === JournalType.Counter
    );
  }

  return (
    <Page
      title={<JournalPageTitle journal={journal} />}
      documentTitle={journal.name}
      actions={titleActions}
      pageActionRoutes={<JournalSubRoutes journal={journal} />}
    >
      {showNotes ? (
        <PageSection>
          <JournalNotes journal={journal} />
        </PageSection>
      ) : null}

      {showFilters ? (
        <EntryFilters
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
          entries={entries}
          journal={journal}
          dateConditions={dateConditions}
          setSelectedAttributeValues={setSelectedAttributeValues}
          selectedAttributeValues={selectedAttributeValues}
        />
      ) : null}

      {entries?.length ? (
        <>
          {showAgenda ? (
            <EntriesAgenda journal={journal} entries={entries}></EntriesAgenda>
          ) : (
            <PageSection overflowXScroll={true} title="Entries">
              <EntriesTable
                journal={journal}
                entries={entries}
                showGroupTotals={showGroupTotals}
                showAddNewEntryRow={
                  showAddNewEntryRow && isTypeThatCanShowAddEntryRow()
                }
                aggregationMode={
                  uiSettings.aggregationMode ??
                  journalDefaultUiSettings.aggregationMode
                }
              />
            </PageSection>
          )}
        </>
      ) : (
        <GenericEmptyPlaceholder
          icon={LocalHotelOutlined}
          message={"No entries available."}
        />
      )}
    </Page>
  );
};
