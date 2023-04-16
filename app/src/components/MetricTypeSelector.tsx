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
  metricType: MetricType;
  onChange: (metricType: MetricType) => void;
}> = ({ metricType, onChange }) => {
  return (
    <FormControl margin="normal">
      <InputLabel id="metric-type-label">
        {translations.label_metricType}
      </InputLabel>
      <Select
        id="metric-type"
        labelId="metric-type-label"
        label={translations.label_metricType}
        value={metricType as unknown as string}
        onChange={(event: SelectChangeEvent) => {
          onChange(event.target.value as unknown as MetricType);
        }}
      >
        <MetricTypeMenuItem
          metricType={MetricType.Scraps}
          label={translations.metricType_scraps}
        />
        <MetricTypeMenuItem
          metricType={MetricType.Counter}
          label={translations.metricType_counter}
        />
        <MetricTypeMenuItem
          metricType={MetricType.Gauge}
          label={translations.metricType_gauge}
        />
        <MetricTypeMenuItem
          metricType={MetricType.Timer}
          label={translations.metricType_timer}
        />
      </Select>
    </FormControl>
  );
};

const MetricTypeMenuItem: React.FC<{
  metricType: MetricType;
  label: string;
}> = ({ metricType, label }) => {
  return (
    <MenuItem value={metricType}>
      <MenuItemContainer>
        <MetricTypeIcon type={metricType} style={IconStyle.Activity} />
        {label}
      </MenuItemContainer>
    </MenuItem>
  );
};

const MenuItemContainer = styled("div")`
  display: flex;
  align-items: center;

  .ngrvd-icon {
    margin-right: ${(p) => p.theme.spacing(1)};
  }
`;
