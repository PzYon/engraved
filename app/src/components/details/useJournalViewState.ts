import { useMemo, useState } from "react";
import { useJournalContext } from "./JournalContext";
import { GroupByTime } from "./chart/consolidation/GroupByTime";
import { MyChartType } from "./chart/grouping/ChartTypeSelector";
import { AggregationMode, IJournalUiSettings } from "./edit/IJournalUiSettings";
import { journalDefaultUiSettings } from "./journalDefaultUiSettings";
import {
  getUiSettings,
  isTypeThatCanShowAddEntryRow,
} from "../../util/journalUtils";
import { DateFilterConfig } from "./edit/DateFilterConfig";

export const useJournalViewState = () => {
  const { journal } = useJournalContext();

  const uiSettings = useMemo<IJournalUiSettings>(
    () => getUiSettings(journal),
    [journal],
  );

  const [groupByTime, setGroupByTime] = useState<GroupByTime>(
    (uiSettings?.groupByTime ??
      journalDefaultUiSettings.groupByTime) as GroupByTime,
  );
  const [attributeKey, setAttributeKey] = useState("-");
  const [chartType, setChartType] = useState<MyChartType>(
    (uiSettings.chartType ?? journalDefaultUiSettings.chartType) as MyChartType,
  );
  const [showNotes, setShowNotes] = useState(!!journal.notes);
  const [showAddNewEntryRow, setShowAddNewEntryRow] = useState(
    isTypeThatCanShowAddEntryRow(journal.type),
  );
  const [showFilters, setShowFilters] = useState(!!uiSettings?.showFilters);
  const [showChart, setShowChart] = useState(!!uiSettings?.showChart);
  const [showAgenda, setShowAgenda] = useState(!!uiSettings?.showAgenda);
  const [aggregationMode, setAggregationMode] = useState<AggregationMode>(
    (uiSettings.aggregationMode ??
      journalDefaultUiSettings.aggregationMode) as AggregationMode,
  );
  const [showThresholds, setShowThresholds] = useState(
    !!uiSettings?.showThresholds,
  );
  const [showGroupTotals, setShowGroupTotals] = useState(
    !!uiSettings?.showGroupTotals,
  );

  const dateFilter: DateFilterConfig =
    uiSettings.dateFilter ?? journalDefaultUiSettings.dateFilter!;

  const footerRowMode =
    uiSettings.footerRowMode ?? journalDefaultUiSettings.footerRowMode;

  return {
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
  };
};
