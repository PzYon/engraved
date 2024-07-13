import React, { useState } from "react";
import { ScrapsJournalType } from "../../../journalTypes/ScrapsJournalType";
import { styled } from "@mui/material";
import { JournalSelector } from "../../common/JournalSelector";
import { Scrap } from "./Scrap";
import { UserRole } from "../../../serverApi/UserRole";
import { useAppContext } from "../../../AppContext";
import { getPermissionsForUser } from "../../overview/journals/useJournalPermissions";
import { ScrapType } from "../../../serverApi/IScrapEntry";

export const QuickAddDialog: React.FC<{
  targetJournalId: string;
  onSuccess?: () => void;
}> = ({ targetJournalId, onSuccess }) => {
  const { user } = useAppContext();

  const scrap = ScrapsJournalType.createBlank(
    true,
    targetJournalId,
    ScrapType.Markdown,
  );

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

      <ScrapContainer>
        <Scrap
          scrap={scrap}
          propsRenderStyle={"none"}
          actionsRenderStyle={"save-only"}
          onSuccess={onSuccess}
          isQuickAdd={true}
          targetJournalId={journalId}
          changeTypeWithoutConfirmation={true}
        />
      </ScrapContainer>
    </>
  );
};

const ScrapContainer = styled("div")`
  padding-top: ${(p) => p.theme.spacing(2)};
  margin-top: ${(p) => p.theme.spacing(2)};
  border-top: 1px solid ${(p) => p.theme.palette.background.default};
`;
