import { GroupByTime } from "../chart/consolidation/GroupByTime";
import { DateFilterConfig } from "./DateFilterConfig";

export type AggregationMode =
  "average" | "sum" | "average-by-time" | "average-by-occurrence";

export type StreakMode = "none" | "positive" | "negative";

export type FooterRowMode = "bottom" | "top" | "both";

export interface IJournalUiSettings {
  showGroupTotals?: boolean;
  chartType?: "line" | "bar" | "doughnut";
  showChart?: boolean;
  showThresholds?: boolean;
  showFilters?: boolean;
  showAgenda?: boolean;
  fixedScales?: {
    min?: number;
    max?: number;
  };
  groupByTime?: GroupByTime;
  dateFilter?: DateFilterConfig;
  aggregationMode?: AggregationMode;
  yAxisUnit?: string;
  emoji?: {
    unified: string;
  };
  streak?: {
    mode: StreakMode;
  };
  footerRowMode?: FooterRowMode;
}
