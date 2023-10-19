import React, { useMemo } from "react";
import { IJournal } from "../../serverApi/IJournal";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { ActionGroup } from "../common/actions/ActionGroup";
import { getCommonActions } from "./getCommonActions";
import { IAction } from "../common/actions/IAction";

export const JournalHeaderActions: React.FC<{
  journal: IJournal;
  enableHotkeys: boolean;
}> = ({ journal, enableHotkeys }) => {
  const { renderDialog } = useDialogContext();

  const actions = useMemo<IAction[]>(
    () => getCommonActions(journal, enableHotkeys, renderDialog),
    [renderDialog, journal, enableHotkeys],
  );

  return <ActionGroup actions={actions} />;
};
