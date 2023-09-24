import React, { useMemo } from "react";
import { IMetric } from "../../serverApi/IMetric";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { Actions } from "../common/actions/Actions";
import { getCommonActions } from "./getCommonActions";
import { IIconButtonAction } from "../common/actions/IIconButtonAction";

export const MetricHeaderActions: React.FC<{ metric: IMetric }> = ({
  metric,
}) => {
  const { renderDialog } = useDialogContext();

  const actions = useMemo<IIconButtonAction[]>(
    () => getCommonActions(metric, renderDialog),
    [metric]
  );

  return <Actions actions={actions} />;
};
