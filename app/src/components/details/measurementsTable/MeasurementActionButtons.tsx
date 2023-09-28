import { IMeasurement } from "../../../serverApi/IMeasurement";
import { ActionIconButton } from "../../common/actions/ActionIconButton";
import React from "react";
import { styled } from "@mui/material";
import { ActionFactory } from "../../common/actions/ActionFactory";

export const MeasurementActionButtons: React.FC<{
  measurement: IMeasurement;
}> = ({ measurement }) => (
  <Host>
    <ActionIconButton action={ActionFactory.editMeasurement(measurement)} />
    <ActionIconButton action={ActionFactory.deleteMeasurement(measurement)} />
  </Host>
);

const Host = styled("div")`
  min-width: 80px;
  display: flex;
`;
