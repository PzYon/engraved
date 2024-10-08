import { IJournal } from "../../../serverApi/IJournal";
import React, { useMemo } from "react";
import { Card, styled, Typography } from "@mui/material";
import { GridContainer, GridItem } from "../../common/Grid";
import { IEntry } from "../../../serverApi/IEntry";
import { calculateThresholds } from "./calculateThresholds";
import { IDateConditions } from "../JournalContext";
import { ThresholdScope } from "./ThresholdScope";

export const Thresholds: React.FC<{
  journal: IJournal;
  entries: IEntry[];
  dateConditions: IDateConditions;
  selectedAttributeValues: Record<string, string[]>;
  setSelectedAttributeValues: (
    attributeKey: string,
    attributeValueKeys: string[],
  ) => void;
}> = ({
  journal,
  entries,
  dateConditions,
  selectedAttributeValues,
  setSelectedAttributeValues,
}) => {
  const thresholdValues = useMemo(() => {
    return calculateThresholds(
      journal.type,
      journal.thresholds,
      entries,
      dateConditions,
    );
  }, [journal.type, journal.thresholds, entries, dateConditions]);

  if (!thresholdValues) {
    return null;
  }

  return (
    <GridContainer>
      {Object.keys(thresholdValues).flatMap((attributeKey) => {
        const attributeThresholds = thresholdValues[attributeKey];

        const attributeName =
          journal.attributes[attributeKey]?.name ?? attributeKey;

        return Object.keys(attributeThresholds).map((valueKey) => {
          const threshold = attributeThresholds[valueKey];
          const valueName =
            journal.attributes[attributeKey]?.values[valueKey] ?? valueKey;
          const currentSelectedValue =
            selectedAttributeValues[attributeKey]?.[0];

          return (
            <GridItem key={attributeKey + "_" + valueKey}>
              <Card
                sx={{
                  p: 2,
                  cursor: attributeKey === "-" ? "cursor" : "pointer",
                  opacity:
                    !currentSelectedValue || currentSelectedValue === valueKey
                      ? 1
                      : 0.5,
                }}
                onClick={() => {
                  if (attributeKey === "-") {
                    return;
                  }

                  setSelectedAttributeValues(
                    attributeKey,
                    currentSelectedValue === valueKey ? [] : [valueKey],
                  );
                }}
              >
                <Typography>
                  {attributeKey === "-" ? (
                    <>All</>
                  ) : (
                    <>
                      {valueName} <Lighter> ({attributeName})</Lighter>
                    </>
                  )}
                  <Lighter
                    title={"Duration in days: " + threshold.durationInDays}
                  >
                    {" | "}
                    {threshold.scope === ThresholdScope.All ? (
                      <>total</>
                    ) : (
                      <>
                        {threshold.thresholdValue} per{" "}
                        {threshold.scope?.toLowerCase()}
                      </>
                    )}
                  </Lighter>
                </Typography>
                <Typography>
                  <ActualValue isBelow={!threshold.isReached}>
                    {Math.abs(Math.round(threshold.remainingValueForDuration))}
                  </ActualValue>{" "}
                  {threshold.currentValue} of {threshold.thresholdForDuration}
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
