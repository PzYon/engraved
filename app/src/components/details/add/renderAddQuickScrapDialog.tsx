import { IDialogProps } from "../../layout/dialogs/DialogContext";
import { IUser } from "../../../serverApi/IUser";
import { ScrapsMetricType } from "../../../metricTypes/ScrapsMetricType";
import { Scrap } from "../scraps/Scrap";
import React, { useState } from "react";
import { styled, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ListScrapIcon, MarkdownScrapIcon } from "../scraps/ScrapsViewPage";
import { ScrapType } from "../../../serverApi/IScrapMeasurement";

export const renderAddQuickScrapDialog = (
  user: IUser,
  renderDialog: (dialogProps: IDialogProps) => void
): void => {
  renderDialog({
    title: "Add Quick Scrap",
    render: (closeDialog) => (
      <AddQuickScrapDialog
        onSuccess={closeDialog}
        metricId={user.favoriteMetricIds[0]}
      />
    ),
  });
};

export const AddQuickScrapDialog: React.FC<{
  onSuccess?: () => void;
  metricId: string;
}> = ({ onSuccess, metricId }) => {
  const [type, setType] = useState<ScrapType>(ScrapType.Markdown);

  const scrap = ScrapsMetricType.createBlank(metricId, type);

  return (
    <>
      <ScrapTypeSelector>
        <ToggleButtonGroup
          value={type}
          exclusive
          onChange={(_, value) => setType(value)}
        >
          <ToggleButton value={ScrapType.Markdown}>
            <MarkdownScrapIcon />
          </ToggleButton>
          <ToggleButton value={ScrapType.List}>
            <ListScrapIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </ScrapTypeSelector>
      <Scrap scrap={scrap} hideDate={true} onSuccess={onSuccess} />
    </>
  );
};

const ScrapTypeSelector = styled("div")`
  display: flex;
  justify-content: end;
`;
