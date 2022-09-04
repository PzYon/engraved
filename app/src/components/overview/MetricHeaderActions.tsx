import React, { useMemo } from "react";
import { IMetric } from "../../serverApi/IMetric";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { HeaderActions } from "../layout/HeaderActions";
import { IIconButtonAction } from "../common/IconButtonWrapper";
import { getMetricHeaderActions } from "./getMetricHeaderActions";

export const MetricHeaderActions: React.FC<{ metric: IMetric }> = ({
  metric,
}) => {
  const { renderDialog } = useDialogContext();

  const actions = useMemo<IIconButtonAction[]>(
    () => getMetricHeaderActions(metric, renderDialog),
    [metric]
  );

  return <HeaderActions actions={actions} enableFloatingActions={false} />;
};
