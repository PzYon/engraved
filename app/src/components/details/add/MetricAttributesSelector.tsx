import React from "react";
import { IMetricAttributeValues } from "../../../serverApi/IMetricAttributeValues";
import { IMetricAttribute } from "../../../serverApi/IMetricAttribute";
import { MetricAttributeSelector } from "./MetricAttributeSelector";
import { IMetricAttributes } from "../../../serverApi/IMetricAttributes";

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
