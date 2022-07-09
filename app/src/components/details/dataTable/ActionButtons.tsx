import { IMeasurement } from "../../../serverApi/IMeasurement";
import { IconButtonWrapper } from "../../common/IconButtonWrapper";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import React from "react";

export const ActionButtons: React.FC<{
  measurement: IMeasurement;
  metricId: string;
}> = ({ measurement, metricId }) => (
  <>
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
  </>
);
