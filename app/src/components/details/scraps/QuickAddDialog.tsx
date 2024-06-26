import React, { useState } from "react";
import { ScrapType } from "../../../serverApi/IScrapEntry";
import { ScrapsJournalType } from "../../../journalTypes/ScrapsJournalType";
import { styled, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ListScrapIcon, MarkdownScrapIcon } from "./ScrapsViewPage";
import { JournalSelector } from "../../common/JournalSelector";
import { Scrap } from "./Scrap";
import { UserRole } from "../../../serverApi/UserRole";
import { useAppContext } from "../../../AppContext";
import { getPermissionsForUser } from "../../overview/journals/useJournalPermissions";

export const QuickAddDialog: React.FC<{
  targetJournalId: string;
  onSuccess?: () => void;
}> = ({ targetJournalId, onSuccess }) => {
  const { user } = useAppContext();

  const [type, setType] = useState<ScrapType>(ScrapType.Markdown);

  const scrap = ScrapsJournalType.createBlank(true, targetJournalId, type);

  const [journalId, setJournalId] = useState(scrap.parentId);

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
          propsRenderStyle={"none"}
          actionsRenderStyle={"save-only"}
          onSuccess={onSuccess}
          isQuickAdd={true}
          targetJournalId={journalId}
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
