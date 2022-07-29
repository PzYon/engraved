import React from "react";
import { useMetricDetailsContext } from "./MetricDetailsContext";
import { Chip, Typography } from "@mui/material";
import { IMetricAttributes } from "../../serverApi/IMetricAttributes";

export const SelectedAttributeValues: React.FC<{
  attributes: IMetricAttributes;
}> = ({ attributes }) => {
  const { selectedAttributeValues, toggleAttributeValue } =
    useMetricDetailsContext();

  const keysWithValues = Object.keys(selectedAttributeValues).filter(
    (k) => selectedAttributeValues[k].length > 0
  );

  if (!keysWithValues.length) {
    return <Typography>Currently showing all measurements.</Typography>;
  }

  return (
    <>
      {keysWithValues.map((attributeKey) => {
        const valueKey = selectedAttributeValues[attributeKey][0];
        const value = attributes[attributeKey].values[valueKey];

        return (
          <React.Fragment key={`${attributeKey}::${value}`}>
            <Typography fontSize="small" variant="caption">
              {attributes[attributeKey].name}
            </Typography>
            <Chip
              sx={{
                marginLeft: "5px",
                marginRight: "15px",
                fontSize: "small",
                height: "22px",
              }}
              title={value}
              label={value}
              onClick={() => {
                toggleAttributeValue(attributeKey, valueKey);
              }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};
