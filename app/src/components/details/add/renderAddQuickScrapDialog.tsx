import { IDialogProps } from "../../layout/dialogs/DialogContext";
import { IUser } from "../../../serverApi/IUser";
import { ScrapsMetricType } from "../../../metricTypes/ScrapsMetricType";
import { Scrap } from "../scraps/Scrap";
import React from "react";

export const renderAddQuickScrapDialog = (
  user: IUser,
  renderDialog: (dialogProps: IDialogProps) => void
): void => {
  renderDialog({
    title: "Add quick scrap",
    render: (closeDialog) => {
      const scrap = ScrapsMetricType.createBlank();
      scrap.metricId = user.favoriteMetricIds[0];

      return <Scrap scrap={scrap} onSuccess={closeDialog} />;
    },
  });
};
