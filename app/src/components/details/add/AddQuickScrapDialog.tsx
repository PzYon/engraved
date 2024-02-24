import React, { useState } from "react";
import { ScrapType } from "../../../serverApi/IScrapEntry";
import { ScrapsJournalType } from "../../../journalTypes/ScrapsJournalType";
import { styled, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ListScrapIcon, MarkdownScrapIcon } from "../scraps/ScrapsViewPage";
import { JournalSelector } from "../../common/JournalSelector";
import { Scrap } from "../scraps/Scrap";
import { UserRole } from "../../../serverApi/UserRole";
import { useAppContext } from "../../../AppContext";
import { getPermissionsForUser } from "../../overview/useJournalPermissions";

export const AddQuickScrapDialog: React.FC<{
  quickScrapJournalId: string;
  onSuccess?: () => void;
}> = ({ quickScrapJournalId, onSuccess }) => {
  const { user } = useAppContext();

  const [type, setType] = useState<ScrapType>(ScrapType.Markdown);

  const [journalId, setJournalId] = useState(quickScrapJournalId ?? "");

  const scrap = ScrapsJournalType.createBlank(journalId, type);

  return (
    <>
      <JournalSelector
        label={"Add to journal"}
        filterJournals={(journals) =>
          journals.filter((j) => {
            const permissions = getPermissionsForUser(j.permissions, user);
            return (
              permissions.userRole === UserRole.Owner ||
              permissions.userRole === UserRole.Writer
            );
          })
        }
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
      <ScrapContainer>
        <Scrap
          key={type}
          scrap={scrap}
          journalName={null}
          propsRenderStyle={"none"}
          actionsRenderStyle={"save-only"}
          withoutSection={true}
          onSuccess={onSuccess}
        />
      </ScrapContainer>
    </>
  );
};

const ScrapTypeSelector = styled("div")`
  padding-top: ${(p) => p.theme.spacing(2)};
  display: flex;
  justify-content: start;
`;

const ScrapContainer = styled("div")`
  padding-top: ${(p) => p.theme.spacing(2)};
  margin-top: ${(p) => p.theme.spacing(2)};
  border-top: 1px solid ${(p) => p.theme.palette.background.default};
`;
