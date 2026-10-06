import {
  IAttributeValueThresholdDefinition,
  ThresholdRow,
} from "./ThresholdRow";
import React, { useState } from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { IJournalThresholdDefinitions } from "../../../serverApi/IJournalThresholdDefinitions";
import {
  createDefinitions,
  createThresholds,
  isComplete,
} from "./thresholdDefinitions";
import AddCircleOutlined from "@mui/icons-material/AddCircleOutlined";
import RemoveCircleOutlined from "@mui/icons-material/RemoveCircleOutlined";
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
              icon: <RemoveCircleOutlined fontSize="small" />,
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
          icon: <AddCircleOutlined fontSize="small" />,
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

function createNewDefinition(): IAttributeValueThresholdDefinition {
  return {
    attributeKey: undefined,
    attributeValueKeys: [],
    threshold: undefined,
    scope: undefined,
    key: Math.random().toString(),
  };
}

const RowContainer = styled("div")`
  display: flex;
  align-items: center;
`;
