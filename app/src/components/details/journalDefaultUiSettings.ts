import { GroupByTime } from "./chart/consolidation/GroupByTime";
import { DateRange } from "./filters/DateRange";
import { IJournalUiSettings } from "./edit/JournalUiSettings";

export const journalDefaultUiSettings: IJournalUiSettings = {
  groupByTime: GroupByTime.Day,
  chartType: "line",
  dateRange: DateRange.Month,
};
