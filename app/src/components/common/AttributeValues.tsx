import { IJournalAttributeValues } from "../../serverApi/IJournalAttributeValues";
import React from "react";
import { IJournalAttributes } from "../../serverApi/IJournalAttributes";
import { Chip, lighten, Tooltip, useTheme } from "@mui/material";
import { getCoefficient } from "../../util/utils";
import { useJournalContext } from "../details/JournalContext";

export const AttributeValues: React.FC<{
  attributes: IJournalAttributes;
  attributeValues: IJournalAttributeValues;
  preventOnClick?: boolean;
  className?: string;
}> = ({ attributes, attributeValues, preventOnClick, className }) => {
  const { palette } = useTheme();

  const { toggleAttributeValue } = useJournalContext();

  const colorByAttributeKey = getColorsByKey(attributes, palette.primary.main);

  const sortedValues = Object.entries(attributeValues).sort();

  if (sortedValues.length === 0) {
    return null;
  }

  return (
    <span
      style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
      className={className}
    >
      {sortedValues.flatMap((value) => {
        const attributeKey = value[0];
        const valueKeys = value[1];
        const attribute = attributes[attributeKey];

        return valueKeys.map((valueKey) => {
          const value = attribute.values[valueKey];
          return (
            <Tooltip
              key={`${attributeKey}::${valueKey}`}
              title={attribute.name + ": " + value}
            >
              <Chip
                component={"span"}
                sx={{
                  backgroundColor: colorByAttributeKey[attributeKey],
                  color: "common.white",
                  fontSize: "small",
                  height: "22px",
                }}
                label={value}
                onClick={
                  preventOnClick || !toggleAttributeValue
                    ? undefined
                    : () => {
                        toggleAttributeValue(attributeKey, valueKey);
                      }
                }
              />
            </Tooltip>
          );
        });
      })}
    </span>
  );
};

function getColorsByKey(attributes: IJournalAttributes, baseColor: string) {
  const attributeKeys = Object.keys(attributes).sort();
  return attributeKeys.reduce(
    (
      aggregated: Record<string, string>,
      attributeKey: string,
      currentIndex,
    ) => {
      aggregated[attributeKey] = lighten(
        baseColor,
        getCoefficient(currentIndex, attributeKeys.length),
      );
      return aggregated;
    },
    {},
  );
}
