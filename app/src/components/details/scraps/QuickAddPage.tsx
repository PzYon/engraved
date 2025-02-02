import React, { useState } from "react";
import { ScrapsJournalType } from "../../../journalTypes/ScrapsJournalType";
import { styled } from "@mui/material";
import { JournalSelector } from "../../common/JournalSelector";
import { Scrap } from "./Scrap";
import { UserRole } from "../../../serverApi/UserRole";
import { useAppContext } from "../../../AppContext";
import { getPermissionsForUser } from "../../overview/journals/useJournalPermissions";
import { ScrapType } from "../../../serverApi/IScrapEntry";
import { PageTitle } from "../../layout/pages/PageTitle";
import { Icon } from "../../common/Icon";
import { IconStyle } from "../../common/IconStyle";
import { FilterMode } from "../../layout/pages/PageContext";
import { Page } from "../../layout/pages/Page";
import { PlaylistAddOutlined } from "@mui/icons-material";
import { PageSection } from "../../layout/pages/PageSection";
import { useNavigate } from "react-router-dom";

export const QuickAddPage: React.FC = () => {
  const { user } = useAppContext();

  const navigate = useNavigate();

  const [journalId, setJournalId] = useState(undefined);

  const scrap = ScrapsJournalType.createBlank(
    true,
    journalId,
    ScrapType.Markdown,
  );

  return (
    <Page
      documentTitle={"Quick Add"}
      title={
        <PageTitle
          title={"Quick Add"}
          icon={
            <Icon style={IconStyle.Large}>
              <PlaylistAddOutlined fontSize="small" />
            </Icon>
          }
        />
      }
      actions={[]}
      tabs={[]}
      filterMode={FilterMode.Text}
      hideActions={true}
    >
      <PageSection>
        <JournalSelector
          label={"Add to journal"}
          storageKey={"quick-add"}
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
        />

        <ScrapContainer>
          <Scrap
            scrap={scrap}
            propsRenderStyle={"none"}
            actionsRenderStyle={"save-only"}
            onSuccess={() => navigate("/entries")}
            isQuickAdd={true}
            changeTypeWithoutConfirmation={true}
            onCancelEditing={() => navigate(-1)}
          />
        </ScrapContainer>
      </PageSection>
    </Page>
  );
};

const ScrapContainer = styled("div")`
  padding-top: ${(p) => p.theme.spacing(2)};
  margin-top: ${(p) => p.theme.spacing(2)};
  border-top: 1px solid ${(p) => p.theme.palette.background.default};
`;
