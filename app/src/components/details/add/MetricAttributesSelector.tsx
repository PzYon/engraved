import React from "react";
import { IMetricAttributes } from "../../../serverApi/IMetricAttributes";

export const MetricAttributesSelector: React.FC<{
  attributes: IMetricAttributes;
  selectedFlagKey: string;
  onFlagChange: (key: string) => void;
}> = ({ attributes, selectedFlagKey, onFlagChange }) => {
  console.log(selectedFlagKey, onFlagChange);

  return (
    <>
      {Object.keys(attributes).map((a) => {
        return <div key={a}>{attributes[a].name}</div>;
      })}
    </>
  );

  /*
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
        {Object.entries(attributes).map(
          (kvps: [key: string, value: string]) => {
            return (
              <MenuItem key={kvps[0]} value={kvps[0]}>
                {kvps[1]}
              </MenuItem>
            );
          }
        )}
      </Select>
    </FormControl>
  );
   */
};
