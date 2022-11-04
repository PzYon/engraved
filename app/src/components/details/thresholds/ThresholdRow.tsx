import { GroupByAttributeSelector } from "../chart/grouping/GroupByAttributeSelector";
import { MetricAttributeSelector } from "../add/MetricAttributeSelector";
import React, { useEffect, useState } from "react";
import { IMetric } from "../../../serverApi/IMetric";
import { styled, TextField } from "@mui/material";

export interface IThresholdDefinition {
  attributeKey: string;
  attributeValueKeys: string[];
  threshold: number;
  key?: string;
}

export const ThresholdRow: React.FC<{
  metric: IMetric;
  definition: IThresholdDefinition;
  onChange: (definition: IThresholdDefinition) => void;
}> = ({ metric, definition, onChange }) => {
  const [attributeKey, setAttributeKey] = useState(
    definition?.attributeKey ?? ""
  );
  const [attributeValueKeys, setAttributeValueKeys] = useState<string[]>(
    definition?.attributeValueKeys ?? []
  );
  const [threshold, setThreshold] = useState(definition?.threshold ?? "");

  useEffect(() => {
    onChange({
      attributeKey,
      attributeValueKeys,
      threshold: Number(threshold),
    });
  }, [attributeKey, attributeValueKeys, threshold]);

  return (
    <Host>
      <GroupByAttributeSelector
        attributes={metric.attributes}
        onChange={setAttributeKey}
        selectedAttributeKey={attributeKey}
      />
      {attributeKey ? (
        <MetricAttributeSelector
          attributeKey={attributeKey}
          attribute={metric.attributes[attributeKey]}
          selectedAttributeValues={{ [attributeKey]: attributeValueKeys }}
          onChange={(attributesValues) => {
            setAttributeValueKeys(attributesValues[attributeKey]);
          }}
        />
      ) : null}
      {Object.keys(attributeValueKeys).length ? (
        <TextField
          type="number"
          defaultValue={threshold}
          onBlur={(event) => setThreshold(event.target.value)}
        />
      ) : null}
    </Host>
  );
};

const Host = styled("div")`
  padding: ${(p) => p.theme.spacing(1)} 0;

  display: flex;

  & > div:not(:last-of-type) {
    margin-right: ${(p) => p.theme.spacing(1)};
  }

  .MuiFormControl-root,
  .MuiAutocomplete-root {
    width: 33%;
  }

  .MuiAutocomplete-root .MuiFormControl-root {
    width: 100%;
  }
`;
