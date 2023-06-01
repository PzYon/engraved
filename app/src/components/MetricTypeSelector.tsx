import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
} from "@mui/material";
import { MetricType } from "../serverApi/MetricType";
import { translations } from "../i18n/translations";
import { MetricTypeIcon } from "./common/MetricTypeIcon";
import { IconStyle } from "./common/Icon";

export const MetricTypeSelector: React.FC<{
  metricType: MetricType | MetricType[];
  onChange: (metricType: MetricType | MetricType[]) => void;
  allowMultiple?: boolean;
  margin?: "dense" | "normal";
}> = ({ metricType, onChange, allowMultiple, margin }) => {
  return (
    <FormControl
      margin={margin ?? "normal"}
      sx={{ backgroundColor: "common.white" }}
    >
      <InputLabel id="metric-type-label">
        {translations.label_metricType}
      </InputLabel>
      <Select
        id="metric-type"
        labelId="metric-type-label"
        label={translations.label_metricType}
        value={metricType as unknown as string}
        multiple={allowMultiple ?? false}
        onChange={(event: SelectChangeEvent) => {
          onChange(event.target.value as unknown as MetricType);
        }}
        sx={{ ".MuiSelect-select": { display: "flex" } }}
      >
        <MenuItem value={MetricType.Scraps}>
          <MetricTypeMenuItem
            metricType={MetricType.Scraps}
            label={translations.metricType_scraps}
          />
        </MenuItem>
        <MenuItem value={MetricType.Counter}>
          <MetricTypeMenuItem
            metricType={MetricType.Counter}
            label={translations.metricType_counter}
          />
        </MenuItem>
        <MenuItem value={MetricType.Gauge}>
          <MetricTypeMenuItem
            metricType={MetricType.Gauge}
            label={translations.metricType_gauge}
          />
        </MenuItem>
        <MenuItem value={MetricType.Timer}>
          <MetricTypeMenuItem
            metricType={MetricType.Timer}
            label={translations.metricType_timer}
          />
        </MenuItem>
      </Select>
    </FormControl>
  );
};

const MetricTypeMenuItem: React.FC<{
  metricType: MetricType;
  label: string;
}> = ({ metricType, label }) => {
  return (
    <MenuItemContainer>
      <MetricTypeIcon type={metricType} style={IconStyle.Activity} />
      {label}
    </MenuItemContainer>
  );
};

const MenuItemContainer = styled("div")`
  display: inline-flex;
  align-items: center;

  .ngrvd-icon {
    margin-right: ${(p) => p.theme.spacing(1)};
  }
`;
