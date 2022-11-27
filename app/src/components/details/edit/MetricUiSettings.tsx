import React from "react";
import { Checkbox, FormControlLabel, styled } from "@mui/material";
import {
  FilterAltOutlined,
  PanToolOutlined,
  ShowChartOutlined,
} from "@mui/icons-material";
import { GroupByTimeSelector } from "../chart/grouping/GroupByTimeSelector";
import { GroupByTime } from "../chart/consolidation/GroupByTime";
import { GridContainer, GridItem } from "../../common/Grid";
import { DateRange } from "../filters/DateFilters";
import { DateRangeSelector } from "../filters/DateRangeSelector";

export interface IMetricUiSettings {
  showChart?: boolean;
  showThresholds?: boolean;
  showFilters?: boolean;
  groupByTime?: GroupByTime;
  dateRange?: DateRange;
}

export const MetricUiSettings: React.FC<{
  uiSettings: IMetricUiSettings;
  onChange: (uiSettings: IMetricUiSettings) => void;
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
          <GroupByTimeSelector
            sx={{ width: "100%" }}
            groupByTime={uiSettings.groupByTime}
            onChange={(groupByTime) => {
              onChange({ ...uiSettings, groupByTime });
            }}
          />
        </GridItem>
        <GridItem>
          <DateRangeSelector
            dateRange={uiSettings.dateRange}
            onChange={(dateRange) => {
              onChange({ ...uiSettings, dateRange });
            }}
          />
        </GridItem>
      </GridContainer>
    </Host>
  );
};

const Host = styled("div")``;
