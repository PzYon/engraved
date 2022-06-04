import React, { useState } from "react";
import { IMetricAttribute } from "../../../serverApi/IMetricAttribute";
import { IMetricAttributeValues } from "../../../serverApi/IMetricAttributeValues";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { AddAttributeValue } from "./AddAttributeValue";
import { IMetric } from "../../../serverApi/IMetric";
import { ServerApi } from "../../../serverApi/ServerApi";

export const MetricAttributeSelector: React.FC<{
  metric: IMetric;
  attributeKey: string;
  attribute: IMetricAttribute;
  selectedAttributeValues: IMetricAttributeValues;
  onChange: (attributesValues: IMetricAttributeValues) => void;
}> = ({
  metric,
  attributeKey,
  attribute,
  selectedAttributeValues,
  onChange,
}) => {
  const [isAddNew, setIsAddNew] = useState(false);

  if (isAddNew) {
    return (
      <AddAttributeValue
        label={"New " + attribute.name}
        onSave={(value) =>
          saveMetric(value).then(() => {
            setIsAddNew(false);
          })
        }
      />
    );
  }

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
          const key = event.target.value;
          if (key === "__new__") {
            setIsAddNew(true);
            return;
          }

          onChange({
            ...selectedAttributeValues,
            ...{ [attributeKey]: [key] },
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
        <MenuItem
          key={"__new__"}
          value={"__new__"}
          sx={{ fontStyle: "italic" }}
        >
          Add new
        </MenuItem>
      </Select>
    </FormControl>
  );

  async function saveMetric(value: string): Promise<void> {
    const metricAttributes = metric.attributes;

    metricAttributes[attributeKey].values[value] = value;

    await ServerApi.editMetric(
      metric.id,
      metric.name,
      metric.description,
      metricAttributes
    );
  }
};
