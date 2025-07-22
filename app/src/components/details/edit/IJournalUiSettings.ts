import { GroupByTime } from "../chart/consolidation/GroupByTime";
import { DateType } from "../filters/DateFilters";
import { DateRange } from "../filters/DateRange";

export type AggregationMode =
  | "average"
  | "sum"
  | "average-by-time"
  | "average-by-occurrence";

export type DateFilterConfig = {
  dateType: DateType;
  value: DateRange | number;
};

export interface IJournalUiSettings {
  showGroupTotals?: boolean;
  chartType?: "line" | "bar" | "doughnut";
  showChart?: boolean;
  showThresholds?: boolean;
  showFilters?: boolean;
  showAgenda?: boolean;
  groupByTime?: GroupByTime;
  dateFilter?: DateFilterConfig;
  dynamicScales?: boolean;
  aggregationMode?: AggregationMode;
  yAxisUnit?: string;
  emoji?: {
    unified: string;
  };
}
