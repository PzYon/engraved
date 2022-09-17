import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";
import { useMetricDetailsContext } from "../MetricDetailsContext";

export const AttributeFilters: React.FC = () => {
  const { selectedAttributeValues, setSelectedAttributeValue, metric } =
    useMetricDetailsContext();

  if (!Object.keys(metric.attributes || {}).length) {
    return null;
  }

  return (
    <>
      {Object.keys(metric.attributes).map((attributeKey) => {
        const attribute = metric.attributes[attributeKey];
        const value = selectedAttributeValues?.[attributeKey]?.[0] ?? "-";

        return (
          <FormControl key={attributeKey} margin="none" sx={{ flexGrow: 1 }}>
            <InputLabel id={`metric-attribute-${attributeKey}-label`}>
              {attribute.name}
            </InputLabel>
            <Select
              id={`metric-attribute-${attributeKey}`}
              labelId={`metric-attribute-${attributeKey}-label`}
              label={attribute.name}
              value={value}
              onChange={(event: SelectChangeEvent) => {
                const selectedKey = event.target.value;

                setSelectedAttributeValue(
                  attributeKey,
                  selectedKey === "-" ? null : selectedKey
                );
              }}
            >
              <MenuItem key={"-"} value={"-"}>
                -
              </MenuItem>
              {Object.keys(attribute.values).map((valueKey) => (
                <MenuItem key={valueKey} value={valueKey}>
                  {attribute.values[valueKey]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      })}
    </>
  );
};
