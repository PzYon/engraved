import {
  IAttributeValueThresholdDefinition,
  ThresholdRow,
} from "./ThresholdRow";
import React, { useState } from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { IJournalThresholdDefinitions } from "../../../serverApi/IJournalThresholdDefinitions";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutline from "@mui/icons-material/RemoveCircleOutline";
import { styled } from "@mui/material";
import { ActionIconButton } from "../../common/actions/ActionIconButton";

export const EditThresholds: React.FC<{
  journal: IJournal;
  onChange: (thresholds: IJournalThresholdDefinitions) => void;
}> = ({ journal, onChange }) => {
  const [thresholdDefinitions, setThresholdDefinitions] = useState<
    IAttributeValueThresholdDefinition[]
  >(createDefinitions(journal.thresholds));

  return (
    <>
      {thresholdDefinitions.map((oldDefinition, i) => (
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
            journal={journal}
            onChange={(definition) => {
              if (!isComplete(definition)) {
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
      ))}

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
  thresholds: IJournalThresholdDefinitions,
): IAttributeValueThresholdDefinition[] {
  return Object.keys(thresholds).flatMap((attributeKey) => {
    return Object.keys(thresholds[attributeKey]).map((x) => {
      return {
        attributeKey: attributeKey,
        threshold: thresholds[attributeKey][x].value,
        scope: thresholds[attributeKey][x].scope,
        attributeValueKeys: [x],
      };
    });
  });
}

function createThresholds(
  thresholdDefinitions: IAttributeValueThresholdDefinition[],
): IJournalThresholdDefinitions {
  const thresholds: IJournalThresholdDefinitions = {};

  for (const definition of thresholdDefinitions) {
    if (!thresholds[definition.attributeKey]) {
      thresholds[definition.attributeKey] = {};
    }

    thresholds[definition.attributeKey][
      definition.attributeValueKeys[0] ?? "-"
    ] = {
      value: definition.threshold,
      scope: definition.scope,
    };
  }

  return thresholds;
}

function createNewDefinition(): IAttributeValueThresholdDefinition {
  return {
    attributeKey: undefined,
    attributeValueKeys: [],
    threshold: undefined,
    scope: undefined,
    key: Math.random().toString(),
  };
}

function isComplete(definition: IAttributeValueThresholdDefinition) {
  if (!definition.threshold || !definition.scope) {
    return false;
  }

  if (
    (!definition.attributeKey || definition.attributeKey === "-") &&
    (!definition.attributeValueKeys.length ||
      (definition.attributeValueKeys.length === 1 &&
        definition.attributeValueKeys[0] === "-"))
  ) {
    return true;
  }

  if (definition.attributeKey && definition.attributeKey !== "-") {
    return true;
  }

  return false;
}

const RowContainer = styled("div")`
  display: flex;
  align-items: center;
`;
