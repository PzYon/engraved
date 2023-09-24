import { IMeasurement } from "../../../serverApi/IMeasurement";
import { IconButtonWrapper } from "../../common/actions/IconButtonWrapper";
import React from "react";
import { styled } from "@mui/material";
import { ActionFactory } from "../../common/actions/ActionFactory";

export const MeasurementActionButtons: React.FC<{
  measurement: IMeasurement;
}> = ({ measurement }) => (
  <Host>
    <IconButtonWrapper action={ActionFactory.editMeasurement(measurement)} />
    <IconButtonWrapper action={ActionFactory.deleteMeasurement(measurement)} />
  </Host>
);

const Host = styled("div")`
  min-width: 80px;
`;
