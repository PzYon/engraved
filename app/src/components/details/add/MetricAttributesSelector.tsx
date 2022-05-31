import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import React from "react";
import { IMetricAttributes } from "../../../serverApi/IMetricAttributes";
import { IMetricAttributeValues } from "../../../serverApi/IMetricAttributeValues";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { IMetricAttribute } from "../../../serverApi/IMetricAttribute";

export const MetricAttributesSelector: React.FC<{
  attributes: IMetricAttributes;
  selectedAttributeValues: IMetricAttributeValues;
  onChange: (attributesValues: IMetricAttributeValues) => void;
}> = ({ attributes, selectedAttributeValues, onChange }) => {
  return (
    <>
      {Object.keys(attributes).map((a) => {
        const attribute: IMetricAttribute = attributes[a];

        return (
          <FormControl key={a}>
            <InputLabel id={"metric-attribute-label-" + a}>
              {attribute.name}
            </InputLabel>
            <Select
              id={"metric-attribute-" + a}
              labelId={"metric-attribute-label-" + a}
              label={attribute.name}
              value={selectedAttributeValues[a]?.[0] || ""}
              onChange={(event: SelectChangeEvent) => {
                onChange({
                  ...selectedAttributeValues,
                  ...{ [a]: [event.target.value] },
                });
              }}
            >
              <MenuItem key={""} value={""}>
                -
              </MenuItem>
              {Object.entries(attribute.values).map(
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
      })}
    </>
  );

  /*
  return (
    <FormControl>
      <InputLabel id="metric-attribute-label">
        {translations.label_metricFlags}
      </InputLabel>
      <Select
        id="metric-attribute"
        labelId="metric-attribute-label"
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
