import { IEntry } from "../../../serverApi/IEntry";
import { IJournal } from "../../../serverApi/IJournal";
import { GroupByTime } from "./consolidation/GroupByTime";
import { AggregationMode } from "../edit/IJournalUiSettings";

export interface IChartProps {
  entries: IEntry[];
  journal: IJournal;
  groupByTime?: GroupByTime;
  groupByAttribute?: string;
  chartType?: string;
  chartUiProps: IChartUiProps;
  onEntriesCalculated?: (numberOfEntries: number) => void;
  aggregationMode?: AggregationMode;
}

export interface IChartUiProps {
  rollingAverage?: number;
}
