import { GroupByTime } from "./chart/consolidation/GroupByTime";
import { DateRange } from "./filters/DateRange";
import { IJournalUiSettings } from "./edit/IJournalUiSettings";

export const journalDefaultUiSettings: IJournalUiSettings = {
  groupByTime: GroupByTime.Day,
  chartType: "line",
  dateFilter: {
    dateType: "range",
    value: DateRange.All,
  },
  aggregationMode: "sum",
  fixedScales: {},
  footerRowMode: "bottom",
};
