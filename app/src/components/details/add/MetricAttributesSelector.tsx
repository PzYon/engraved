import React from "react";
import { IMetricAttributeValues } from "../../../serverApi/IMetricAttributeValues";
import { IMetricAttribute } from "../../../serverApi/IMetricAttribute";
import { MetricAttributeSelector } from "./MetricAttributeSelector";
import { IMetric } from "../../../serverApi/IMetric";

export const MetricAttributesSelector: React.FC<{
  metric: IMetric;
  selectedAttributeValues: IMetricAttributeValues;
  onChange: (attributesValues: IMetricAttributeValues) => void;
}> = ({ metric, selectedAttributeValues, onChange }) => {
  const attributes = metric.attributes;

  return (
    <>
      {Object.keys(attributes).map((attributeKey) => {
        const attribute: IMetricAttribute = attributes[attributeKey];

        return (
          <React.Fragment key={attributeKey}>
            <MetricAttributeSelector
              attributeKey={attributeKey}
              attribute={attribute}
              selectedAttributeValues={selectedAttributeValues}
              onChange={onChange}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};
