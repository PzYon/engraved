import { IMetricAttributeValues } from "../../serverApi/IMetricAttributeValues";
import React from "react";
import { IMetricAttributes } from "../../serverApi/IMetricAttributes";
import { Chip, lighten } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getCoefficient } from "./utils";

export const AttributeValues: React.FC<{
  attributes: IMetricAttributes;
  attributeValues: IMetricAttributeValues;
}> = ({ attributes, attributeValues }) => {
  const { palette } = useTheme();

  const colorByAttributeKey = getColorsByKey(attributes, palette.primary.main);

  return (
    <>
      {Object.entries(attributeValues)
        .sort()
        .flatMap((value) => {
          const attributeKey = value[0];
          const valueKeys = value[1];
          const attribute = attributes[attributeKey];

          return valueKeys.map((k) => {
            const value = attribute.values[k];
            return (
              <Chip
                key={k}
                sx={{
                  backgroundColor: colorByAttributeKey[attributeKey],
                  color: "common.white",
                  marginLeft: "5px",
                  fontSize: "small",
                }}
                title={attribute.name + ": " + value}
                label={value}
              />
            );
          });
        })}
    </>
  );
};

function getColorsByKey(attributes: IMetricAttributes, baseColor: string) {
  const attributeKeys = Object.keys(attributes);
  return attributeKeys.reduce(
    (
      aggregated: { [attributeKey: string]: string },
      attributeKey: string,
      currentIndex
    ) => {
      aggregated[attributeKey] = lighten(
        baseColor,
        getCoefficient(currentIndex, attributeKeys.length)
      );
      return aggregated;
    },
    {}
  );
}
