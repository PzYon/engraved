import { IJournalAttributeValues } from "../../serverApi/IJournalAttributeValues";
import React from "react";
import { IJournalAttributes } from "../../serverApi/IJournalAttributes";
import { Chip, lighten, useTheme } from "@mui/material";
import { getCoefficient } from "../../util/utils";
import { useJournalContext } from "../details/JournalContext";

export const AttributeValues: React.FC<{
  attributes: IJournalAttributes;
  attributeValues: IJournalAttributeValues;
  preventOnClick?: boolean;
}> = ({ attributes, attributeValues, preventOnClick }) => {
  const { palette } = useTheme();

  const { toggleAttributeValue } = useJournalContext();

  const colorByAttributeKey = getColorsByKey(attributes, palette.primary.main);

  return (
    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
      {Object.entries(attributeValues)
        .sort()
        .flatMap((value) => {
          const attributeKey = value[0];
          const valueKeys = value[1];
          const attribute = attributes[attributeKey];

          return valueKeys.map((valueKey) => {
            const value = attribute.values[valueKey];
            return (
              <Chip
                key={`${attributeKey}::${valueKey}`}
                sx={{
                  backgroundColor: colorByAttributeKey[attributeKey],
                  color: "common.white",
                  fontSize: "small",
                  height: "22px",
                }}
                title={attribute.name + ": " + value}
                label={value}
                onClick={
                  preventOnClick || !toggleAttributeValue
                    ? null
                    : () => {
                        toggleAttributeValue(attributeKey, valueKey);
                      }
                }
              />
            );
          });
        })}
    </div>
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
