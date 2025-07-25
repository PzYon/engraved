import React from "react";
import { Checkbox, FormControlLabel, styled, TextField } from "@mui/material";
import FilterAltOutlined from "@mui/icons-material/FilterAltOutlined";
import FunctionsOutlined from "@mui/icons-material/FunctionsOutlined";
import HistoryToggleOff from "@mui/icons-material/HistoryToggleOff";
import PanToolOutlined from "@mui/icons-material/PanToolOutlined";
import ShowChartOutlined from "@mui/icons-material/ShowChartOutlined";
import { GroupByTimeSelector } from "../chart/grouping/GroupByTimeSelector";
import { GridContainer, GridItem } from "../../common/Grid";
import { ChartTypeSelector } from "../chart/grouping/ChartTypeSelector";
import { journalDefaultUiSettings } from "../journalDefaultUiSettings";
import { AggregationModeSelector } from "../chart/AggregationModeSelector";
import { IJournalUiSettings } from "./IJournalUiSettings";
import { DateFilterConfigSelector } from "../filters/DateFilterConfigSelector";

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
                checked={uiSettings.showAgenda}
                onChange={(_, checked) =>
                  onChange({ ...uiSettings, showAgenda: checked })
                }
                icon={<HistoryToggleOff sx={{ opacity: 0.5 }} />}
                checkedIcon={<HistoryToggleOff />}
              />
            }
            label="Show agenda view by default"
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
            label="Show group aggregations by default"
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

        <GridItem />

        <GridItem>
          <TextField
            id={Math.random().toString()}
            label="Y-Axis Unit"
            sx={{ width: "100%" }}
            value={uiSettings.yAxisUnit}
            onChange={(x) => {
              onChange({ ...uiSettings, yAxisUnit: x.target.value });
            }}
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

        <GridItem>
          <DateFilterConfigSelector
            dateFilterConfig={
              uiSettings.dateFilter ?? journalDefaultUiSettings.dateFilter
            }
            setDateFilterConfig={(config) => {
              onChange({ ...uiSettings, dateFilter: config });
            }}
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
          <AggregationModeSelector
            aggregationMode={
              uiSettings.aggregationMode ??
              journalDefaultUiSettings.aggregationMode
            }
            onChange={(aggregationMode) => {
              onChange({ ...uiSettings, aggregationMode });
            }}
          />
        </GridItem>
      </GridContainer>
    </Host>
  );
};

const Host = styled("div")``;
