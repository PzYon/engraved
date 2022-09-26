import { IMeasurement } from "../../../serverApi/IMeasurement";
import { IconButtonWrapper } from "../../common/IconButtonWrapper";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import React from "react";
import { styled } from "@mui/material";

export const ActionButtons: React.FC<{
  measurement: IMeasurement;
  metricId: string;
}> = ({ measurement, metricId }) => (
  <Host>
    <IconButtonWrapper
      action={{
        key: "edit-measurement",
        label: "Edit Measurement",
        href: `/metrics/${metricId}/measurements/${measurement.id}/edit`,
        icon: <EditOutlined fontSize="small" />,
      }}
    />
    <IconButtonWrapper
      action={{
        key: "delete-measurement",
        label: "Delete Measurement",
        href: `/metrics/${metricId}/measurements/${measurement.id}/delete`,
        icon: <DeleteOutlined fontSize="small" />,
      }}
    />
  </Host>
);

const Host = styled("div")`
  min-width: 80px;
`;
