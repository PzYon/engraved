import { IMeasurement } from "../../../serverApi/IMeasurement";
import { IconButtonWrapper } from "../../common/IconButtonWrapper";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import React from "react";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { Button, Typography } from "@mui/material";
import { ServerApi } from "../../../serverApi/ServerApi";

export const ActionButtons: React.FC<{
  measurement: IMeasurement;
  metricId: string;
}> = ({ measurement, metricId }) => {
  const { renderDialog } = useDialogContext();

  return (
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
          icon: <DeleteOutlined fontSize="small" />,
          onClick: () =>
            renderDialog({
              title: "Delete Measurement",
              render: (closeDialog) => {
                return (
                  <>
                    <Typography>Are you sure?</Typography>
                    <Button variant="outlined" onClick={closeDialog}>
                      No
                    </Button>
                    <Button
                      variant="text"
                      color="primary"
                      onClick={() => deleteMeasurement(closeDialog)}
                    >
                      Yes
                    </Button>
                  </>
                );
              },
            }),
        }}
      />
    </>
  );

  async function deleteMeasurement(closeDialog: () => void) {
    await ServerApi.deleteMeasurement(measurement.id);
    closeDialog();
  }
};
