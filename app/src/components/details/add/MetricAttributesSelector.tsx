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
      {Object.keys(attributes).map((attributeKey) => {
        const attribute: IMetricAttribute = attributes[attributeKey];

        return (
          <FormControl key={attributeKey}>
            <InputLabel id={"metric-attribute-label-" + attributeKey}>
              {attribute.name}
            </InputLabel>
            <Select
              id={"metric-attribute-" + attributeKey}
              labelId={"metric-attribute-label-" + attributeKey}
              label={attribute.name}
              value={selectedAttributeValues[attributeKey]?.[0] || ""}
              onChange={(event: SelectChangeEvent) => {
                onChange({
                  ...selectedAttributeValues,
                  ...{ [attributeKey]: [event.target.value] },
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
};
