import React, { useMemo } from "react";
import { IMetric } from "../../serverApi/IMetric";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { ActionGroup } from "../common/actions/ActionGroup";
import { getCommonActions } from "./getCommonActions";
import { IAction } from "../common/actions/IAction";

export const MetricHeaderActions: React.FC<{
  metric: IMetric;
  enableHotkeys: boolean;
}> = ({ metric, enableHotkeys }) => {
  const { renderDialog } = useDialogContext();

  const actions = useMemo<IAction[]>(
    () => getCommonActions(metric, enableHotkeys, renderDialog),
    [metric, enableHotkeys]
  );

  return <ActionGroup actions={actions} />;
};
