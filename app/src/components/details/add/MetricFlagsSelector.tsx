import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { translations } from "../../../i18n/translations";

export interface IMetricFlags {
  [key: string]: string;
}

export const MetricFlagsSelector: React.FC<{
  flags: IMetricFlags;
  selectedFlagKey: string;
  onFlagChange: (key: string) => void;
}> = ({ flags, selectedFlagKey, onFlagChange }) => {
  return (
    <FormControl>
      <InputLabel id="metric-flags-label">
        {translations.label_metricFlags}
      </InputLabel>
      <Select
        id="metric-flags"
        labelId="metric-flags-label"
        label={translations.label_metricFlags}
        value={selectedFlagKey}
        onChange={(event: SelectChangeEvent) => {
          onFlagChange(event.target.value);
        }}
      >
        <MenuItem key={""} value={""}>
          &nbsp;
        </MenuItem>
        {Object.entries(flags).map((kvps: [key: string, value: string]) => {
          return (
            <MenuItem key={kvps[0]} value={kvps[0]}>
              {kvps[1]}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
