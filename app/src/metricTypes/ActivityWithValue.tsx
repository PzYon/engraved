import React from "react";
import { IMetric } from "../serverApi/IMetric";
import { IMeasurement } from "../serverApi/IMeasurement";
import { AttributeValues } from "../components/common/AttributeValues";
import { styled, Typography } from "@mui/material";
import { Activity } from "./Activity";
import { Actions } from "../components/common/Actions";
import { ActionFactory } from "../components/common/IconButtonWrapper";

export const ActivityWithValue: React.FC<{
  value: React.ReactNode;
  metric: IMetric;
  measurement: IMeasurement;
}> = ({ metric, measurement, value }) => {
  return (
    <Activity metric={metric} measurement={measurement}>
      <Typography component={"span"}>{value}</Typography>
      <Typography component={"span"} sx={{ fontWeight: "lighter" }}>
        {measurement.notes ? ` - ${measurement.notes}` : ""}
      </Typography>
      <AttributeValues
        attributes={metric.attributes}
        attributeValues={measurement.metricAttributeValues}
      />
      <FooterContainer>
        <Actions
          actions={[
            ActionFactory.editMeasurement(measurement),
            ActionFactory.deleteMeasurement(measurement),
          ]}
        />
      </FooterContainer>
    </Activity>
  );
};

const FooterContainer = styled("div")`
  display: flex;
  justify-content: end;
  align-items: center;
`;
