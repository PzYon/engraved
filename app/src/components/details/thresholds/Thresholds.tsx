import { IJournal } from "../../../serverApi/IJournal";
import React from "react";
import { Card, styled, Typography } from "@mui/material";
import { GridContainer, GridItem } from "../../common/Grid";
import { IEntry } from "../../../serverApi/IEntry";
import { calculateThresholds } from "./calculateThresholds";

export const Thresholds: React.FC<{
  journal: IJournal;
  entries: IEntry[];
  selectedAttributeValues: Record<string, string[]>;
  setSelectedAttributeValues: (
    attributeKey: string,
    attributeValueKeys: string[],
  ) => void;
}> = ({
  journal,
  entries,
  selectedAttributeValues,
  setSelectedAttributeValues,
}) => {
  const thresholdValues = calculateThresholds(
    journal.type,
    journal.thresholds,
    entries,
  );

  // todo: delete everything server side starting from here
  // const thresholdValues = useJournalThresholdsValuesQuery(journal.id);

  if (!thresholdValues) {
    return null;
  }

  return (
    <GridContainer>
      {Object.keys(thresholdValues).flatMap((attributeKey) => {
        const attributeThresholds = thresholdValues[attributeKey];

        return Object.keys(attributeThresholds).map((valueKey) => {
          const threshold = attributeThresholds[valueKey];
          const attributeName =
            journal.attributes[attributeKey]?.name ?? attributeKey;
          const valueName =
            journal.attributes[attributeKey]?.values[valueKey] ?? valueKey;

          const currentSelectedValue =
            selectedAttributeValues[attributeKey]?.[0];

          return (
            <GridItem key={attributeKey + "_" + valueKey}>
              <Card
                sx={{
                  p: 2,
                  cursor: "pointer",
                  opacity:
                    !currentSelectedValue || currentSelectedValue === valueKey
                      ? 1
                      : 0.5,
                }}
                onClick={() => {
                  setSelectedAttributeValues(
                    attributeKey,
                    currentSelectedValue === valueKey ? [] : [valueKey],
                  );
                }}
              >
                <Typography>
                  {attributeName === "-" ? (
                    <>All</>
                  ) : (
                    <>
                      {valueName} <Lighter>({attributeName})</Lighter>
                    </>
                  )}{" "}
                  [{threshold.scope}]
                </Typography>
                <Typography>
                  <ActualValue isBelow={!threshold.isReached}>
                    {Math.round(threshold.remainingValue)}
                  </ActualValue>{" "}
                  {threshold.currentValue}
                  <Lighter> / {threshold.thresholdValue}</Lighter>
                </Typography>
              </Card>
            </GridItem>
          );
        });
      })}
    </GridContainer>
  );
};

const ActualValue = styled("span")<{ isBelow: boolean }>`
  font-size: xx-large;
  font-weight: bold;
  color: ${(p) => (p.isBelow ? "green" : "red")};
  margin-right: ${(p) => p.theme.spacing(1)};
`;

const Lighter = styled("span")`
  font-weight: lighter;
`;
