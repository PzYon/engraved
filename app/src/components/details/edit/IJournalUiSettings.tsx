import { GroupByTime } from "../chart/consolidation/GroupByTime";
import { DateRange } from "../filters/DateRange";

export type AggregationMode = "average" | "sum";

export interface IJournalUiSettings {
  showGroupTotals?: boolean;
  chartType?: "line" | "bar" | "doughnut";
  showChart?: boolean;
  showThresholds?: boolean;
  showFilters?: boolean;
  groupByTime?: GroupByTime;
  dateRange?: DateRange;
  dynamicScales?: boolean;
  aggregationMode?: AggregationMode;
}
