import React from "react";
import { Checkbox, FormControlLabel, styled } from "@mui/material";
import {
  FilterAltOutlined,
  FunctionsOutlined,
  PanToolOutlined,
  QueryStatsOutlined,
  ShowChartOutlined,
} from "@mui/icons-material";
import { GroupByTimeSelector } from "../chart/grouping/GroupByTimeSelector";
import { GroupByTime } from "../chart/consolidation/GroupByTime";
import { GridContainer, GridItem } from "../../common/Grid";
import { DateRangeSelector } from "../filters/DateRangeSelector";
import { ChartTypeSelector } from "../chart/grouping/ChartTypeSelector";
import { journalDefaultUiSettings } from "../journalDefaultUiSettings";
import { DateRange } from "../filters/DateRange";

export interface IJournalUiSettings {
  showGroupTotals?: boolean;
  chartType?: "line" | "bar" | "doughnut";
  showChart?: boolean;
  showThresholds?: boolean;
  showFilters?: boolean;
  groupByTime?: GroupByTime;
  dateRange?: DateRange;
  dynamicScales?: boolean;
}

export const JournalUiSettings: React.FC<{
  uiSettings: IJournalUiSettings;
  onChange: (uiSettings: IJournalUiSettings) => void;
}> = ({ uiSettings, onChange }) => {
  return (
    <Host>
      <GridContainer>
        <GridItem>
          <FormControlLabel
            control={
              <Checkbox
                checked={uiSettings.showChart}
                onChange={(_, checked) =>
                  onChange({ ...uiSettings, showChart: checked })
                }
                icon={<ShowChartOutlined sx={{ opacity: 0.5 }} />}
                checkedIcon={<ShowChartOutlined />}
              />
            }
            label="Show chart by default"
          />
        </GridItem>
        <GridItem>
          <FormControlLabel
            control={
              <Checkbox
                checked={uiSettings.showThresholds}
                onChange={(_, checked) =>
                  onChange({ ...uiSettings, showThresholds: checked })
                }
                icon={<PanToolOutlined sx={{ opacity: 0.5 }} />}
                checkedIcon={<PanToolOutlined />}
              />
            }
            label="Show thresholds by default"
          />
        </GridItem>
        <GridItem>
          <FormControlLabel
            control={
              <Checkbox
                checked={uiSettings.showFilters}
                onChange={(_, checked) =>
                  onChange({ ...uiSettings, showFilters: checked })
                }
                icon={<FilterAltOutlined sx={{ opacity: 0.5 }} />}
                checkedIcon={<FilterAltOutlined />}
              />
            }
            label="Show filters by default"
          />
        </GridItem>
        <GridItem>
          <FormControlLabel
            control={
              <Checkbox
                checked={uiSettings.showGroupTotals}
                onChange={(_, checked) =>
                  onChange({ ...uiSettings, showGroupTotals: checked })
                }
                icon={<FunctionsOutlined sx={{ opacity: 0.5 }} />}
                checkedIcon={<FunctionsOutlined />}
              />
            }
            label="Show group totals by default"
          />
        </GridItem>
        <GridItem>
          <GroupByTimeSelector
            sx={{ width: "100%" }}
            groupByTime={
              uiSettings.groupByTime ?? journalDefaultUiSettings.groupByTime
            }
            onChange={(groupByTime) => {
              onChange({ ...uiSettings, groupByTime });
            }}
          />
        </GridItem>
        <GridItem>
          <DateRangeSelector
            dateRange={
              uiSettings.dateRange ?? journalDefaultUiSettings.dateRange
            }
            onChange={(dateRange) => {
              onChange({ ...uiSettings, dateRange });
            }}
          />
        </GridItem>
        <GridItem>
          <FormControlLabel
            control={
              <Checkbox
                checked={uiSettings.dynamicScales}
                onChange={(_, checked) =>
                  onChange({ ...uiSettings, dynamicScales: checked })
                }
                icon={<QueryStatsOutlined sx={{ opacity: 0.5 }} />}
                checkedIcon={<QueryStatsOutlined />}
              />
            }
            label="Dynamic scales"
          />
        </GridItem>
        <GridItem>
          <ChartTypeSelector
            chartType={
              uiSettings.chartType ?? journalDefaultUiSettings.chartType
            }
            onChange={(chartType) => {
              onChange({ ...uiSettings, chartType });
            }}
          />
        </GridItem>
      </GridContainer>
    </Host>
  );
};

const Host = styled("div")``;
