import React, { useState } from "react";
import { ScrapType } from "../../../serverApi/IScrapEntry";
import { ScrapsJournalType } from "../../../journalTypes/ScrapsJournalType";
import { styled, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ListScrapIcon, MarkdownScrapIcon } from "../scraps/ScrapsViewPage";
import { Scrap } from "../scraps/Scrap";
import { JournalSelector } from "../../common/JournalSelector";

export const AddQuickScrapDialog: React.FC<{
  onSuccess?: () => void;
  quickScrapJournalId: string;
}> = ({ onSuccess, quickScrapJournalId }) => {
  const [type, setType] = useState<ScrapType>(ScrapType.Markdown);

  const [journalId, setJournalId] = useState(quickScrapJournalId ?? "");

  const scrap = ScrapsJournalType.createBlank(journalId, type);

  return (
    <>
      <JournalSelector
        label={"Add to journal"}
        onChange={(journal) => setJournalId(journal.id)}
        selectedJournalId={journalId}
      />
      <ScrapTypeSelector>
        <ToggleButtonGroup
          value={type}
          exclusive
          sx={{ width: "100%", ".MuiButtonBase-root": { width: "50%" } }}
          onChange={(_, value) => {
            setType(
              value !== null
                ? value
                : type === ScrapType.Markdown
                  ? ScrapType.List
                  : ScrapType.Markdown,
            );
          }}
        >
          <ToggleButton value={ScrapType.Markdown} color="primary">
            <MarkdownScrapIcon />
            &nbsp;Markdown
          </ToggleButton>
          <ToggleButton value={ScrapType.List} color="primary">
            <ListScrapIcon />
            &nbsp;List
          </ToggleButton>
        </ToggleButtonGroup>
      </ScrapTypeSelector>
      <Scrap
        scrap={scrap}
        hideDate={true}
        onSuccess={onSuccess}
        style={{ marginTop: "3px" }}
        withoutSection={true}
        key={type}
      />
    </>
  );
};

const ScrapTypeSelector = styled("div")`
  padding-top: ${(p) => p.theme.spacing(2)};
  display: flex;
  justify-content: start;
`;
