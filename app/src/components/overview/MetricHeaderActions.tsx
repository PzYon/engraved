import React, { useMemo } from "react";
import { IMetric } from "../../serverApi/IMetric";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { HeaderActions } from "../layout/HeaderActions";
import { IIconButtonAction } from "../common/IconButtonWrapper";
import { getCommonActions } from "./getCommonActions";

export const MetricHeaderActions: React.FC<{ metric: IMetric }> = ({
  metric,
}) => {
  const { renderDialog } = useDialogContext();

  const actions = useMemo<IIconButtonAction[]>(
    () => getCommonActions(metric, renderDialog),
    [metric]
  );

  return <HeaderActions actions={actions} enableFloatingActions={false} />;
};
