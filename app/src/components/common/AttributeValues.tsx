import { IMetricAttributeValues } from "../../serverApi/IMetricAttributeValues";
import React from "react";
import { IMetricAttributes } from "../../serverApi/IMetricAttributes";
import { Chip } from "@mui/material";

export const AttributeValues: React.FC<{
  attributes: IMetricAttributes;
  attributeValues: IMetricAttributeValues;
}> = ({ attributes, attributeValues }) => {
  return (
    <span>
      {Object.entries(attributeValues).map((value) => {
        const attributeKey = value[0];
        const valueKeys = value[1];
        const attribute = attributes[attributeKey];

        return (
          <>
            {valueKeys.map((k) => {
              const value = attribute.values[k];
              return (
                <Chip
                  key={k}
                  sx={{
                    backgroundColor: "primary.main",
                    color: "common.white",
                  }}
                  title={attribute.name + ": " + value}
                  label={value}
                />
              );
            })}
          </>
        );
      })}
    </span>
  );
};
