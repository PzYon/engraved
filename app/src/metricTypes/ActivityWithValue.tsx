import React from "react";
import { IMetric } from "../serverApi/IMetric";
import { IMeasurement } from "../serverApi/IMeasurement";
import { AttributeValues } from "../components/common/AttributeValues";
import { styled, Typography } from "@mui/material";
import { Activity } from "./Activity";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { Actions } from "../components/common/Actions";

export const ActivityWithValue: React.FC<{
  value: React.ReactNode;
  metric: IMetric;
  measurement: IMeasurement;
}> = ({ metric, measurement, value }) => {
  return (
    <Activity metric={metric} measurement={measurement}>
      <Typography component={"span"}>{value}</Typography>
      <AttributeValues
        attributes={metric.attributes}
        attributeValues={measurement.metricAttributeValues}
      />
      <FooterContainer>
        <Actions
          actions={[
            {
              key: "edit",
              label: "Edit",
              icon: <EditOutlined fontSize="small" />,
              href: `/metrics/${metric.id}/measurements/${measurement.id}/edit`,
            },
            {
              key: "delete",
              label: "Delete",
              icon: <DeleteOutlined fontSize="small" />,
              href: `/metrics/${metric.id}/measurements/${measurement.id}/delete`,
            },
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
