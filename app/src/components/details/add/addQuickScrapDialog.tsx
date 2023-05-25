import React, { useState } from "react";
import { ScrapType } from "../../../serverApi/IScrapMeasurement";
import { ScrapsMetricType } from "../../../metricTypes/ScrapsMetricType";
import { styled, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ListScrapIcon, MarkdownScrapIcon } from "../scraps/ScrapsViewPage";
import { Scrap } from "../scraps/Scrap";

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
          sx={{ width: "100%", ".MuiButtonBase-root": { flexGrow: 1 } }}
          onChange={(_, value) => {
            setType(
              value !== null
                ? value
                : type === ScrapType.Markdown
                ? ScrapType.List
                : ScrapType.Markdown
            );
          }}
        >
          <ToggleButton value={ScrapType.Markdown} color="primary">
            <MarkdownScrapIcon />
            Markdown
          </ToggleButton>
          <ToggleButton value={ScrapType.List} color="primary">
            <ListScrapIcon />
            List
          </ToggleButton>
        </ToggleButtonGroup>
      </ScrapTypeSelector>
      <Scrap scrap={scrap} hideDate={true} onSuccess={onSuccess} />
    </>
  );
};

const ScrapTypeSelector = styled("div")`
  display: flex;
  justify-content: start;
`;
