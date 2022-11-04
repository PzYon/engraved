import { IThresholdDefinition, ThresholdRow } from "./ThresholdRow";
import React, { useState } from "react";
import { Button, styled } from "@mui/material";
import { IMetric } from "../../../serverApi/IMetric";
import { ServerApi } from "../../../serverApi/ServerApi";
import { IMetricThresholds } from "../../../serverApi/IMetricThresholds";

export const EditThresholds: React.FC<{ metric: IMetric }> = ({ metric }) => {
  const [thresholdDefinitions, setThresholdDefinitions] = useState<
    IThresholdDefinition[]
  >([...createDefinitions(metric.thresholds), createNewDefinition()]);

  metric.thresholds;

  return (
    <Host>
      {thresholdDefinitions.map((d, i) => {
        return (
          <ThresholdRow
            key={
              d.key ?? d.attributeKey ?? "-" + "_" + d.attributeValueKeys.join()
            }
            definition={d}
            metric={metric}
            onChange={(definition) => {
              if (isIncomplete(definition) || !isIncomplete(d)) {
                return;
              }

              const newDefinitions = [...thresholdDefinitions];
              newDefinitions[i] = definition;
              newDefinitions.push(createNewDefinition());

              setThresholdDefinitions(newDefinitions);
            }}
          />
        );
      })}
      <Button
        onClick={() => {
          ServerApi.editMetric(
            metric.id,
            metric.name,
            metric.description,
            metric.notes,
            metric.attributes,
            createThresholds(thresholdDefinitions)
          );
        }}
      >
        Save
      </Button>
    </Host>
  );
};

function createDefinitions(
  thresholds: IMetricThresholds
): IThresholdDefinition[] {
  return Object.keys(thresholds).flatMap((attributeKey) => {
    return Object.keys(thresholds[attributeKey]).map((x) => {
      return {
        attributeKey: attributeKey,
        threshold: thresholds[attributeKey][x],
        attributeValueKeys: [x],
      };
    });
  });
}

function createThresholds(
  thresholdDefinitions: IThresholdDefinition[]
): IMetricThresholds {
  const thresholds: IMetricThresholds = {};

  for (const definition of thresholdDefinitions) {
    if (!thresholds[definition.attributeKey]) {
      thresholds[definition.attributeKey] = {};
    }

    thresholds[definition.attributeKey][definition.attributeValueKeys[0]] =
      definition.threshold;
  }

  return thresholds;
}

function createNewDefinition(): IThresholdDefinition {
  return {
    attributeKey: undefined,
    attributeValueKeys: [],
    threshold: undefined,
    key: Math.random().toString(),
  };
}

function isIncomplete(definition: IThresholdDefinition) {
  return (
    !definition.attributeKey ||
    !definition.attributeValueKeys?.length ||
    !(definition.threshold > 0)
  );
}

const Host = styled("div")``;
