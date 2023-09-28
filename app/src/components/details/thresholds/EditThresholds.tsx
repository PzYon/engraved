import { IThresholdDefinition, ThresholdRow } from "./ThresholdRow";
import React, { useState } from "react";
import { IMetric } from "../../../serverApi/IMetric";
import { IMetricThresholds } from "../../../serverApi/IMetricThresholds";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { styled } from "@mui/material";
import { ActionIconButton } from "../../common/actions/ActionIconButton";

export const EditThresholds: React.FC<{
  metric: IMetric;
  onChange: (thresholds: IMetricThresholds) => void;
}> = ({ metric, onChange }) => {
  const [thresholdDefinitions, setThresholdDefinitions] = useState<
    IThresholdDefinition[]
  >(createDefinitions(metric.thresholds));

  metric.thresholds;

  return (
    <>
      {thresholdDefinitions.map((oldDefinition, i) => {
        return (
          <RowContainer
            key={
              oldDefinition.key ??
              oldDefinition.attributeKey +
                "-" +
                oldDefinition.attributeValueKeys.join()
            }
          >
            <ThresholdRow
              styles={{ flexGrow: 1 }}
              definition={oldDefinition}
              metric={metric}
              onChange={(definition) => {
                const isCurrentIncomplete = isIncomplete(definition);
                if (isCurrentIncomplete) {
                  return;
                }

                const newDefinitions = [...thresholdDefinitions];
                newDefinitions[i] = definition;

                setThresholdDefinitions(newDefinitions);
                onChange(createThresholds(newDefinitions));
              }}
            />

            <ActionIconButton
              action={{
                key: "remove",
                label: "Remove",
                icon: <RemoveCircleOutline fontSize="small" />,
                onClick: () => {
                  const newDefinitions = [...thresholdDefinitions];
                  newDefinitions.splice(i, 1);

                  setThresholdDefinitions(newDefinitions);
                  onChange(createThresholds(newDefinitions));
                },
              }}
            />
          </RowContainer>
        );
      })}

      <ActionIconButton
        action={{
          key: "add",
          label: "Add",
          icon: <AddCircleOutline fontSize="small" />,
          onClick: () => {
            setThresholdDefinitions([
              ...thresholdDefinitions,
              createNewDefinition(),
            ]);
          },
        }}
      />
    </>
  );
};

function createDefinitions(
  thresholds: IMetricThresholds,
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
  thresholdDefinitions: IThresholdDefinition[],
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

const RowContainer = styled("div")`
  display: flex;
  align-items: center;
`;
