import React, { useRef } from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { Box, styled, Typography } from "@mui/material";
import { useJournalProperties } from "./useJournalProperties";
import { JournalTypeIcon } from "../../common/JournalTypeIcon";
import { PageSection } from "../../layout/pages/PageSection";
import { ActionLink } from "../../common/actions/ActionLink";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { getCommonActions } from "../getCommonActions";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { ListItemFooterRow } from "../ListItemFooterRow";
import { IconStyle } from "../../common/IconStyle";

import { ReadonlyTitleRow } from "../ReadonlyTitleRow";
import { useAppContext } from "../../../AppContext";

export const JournalListItem: React.FC<{
  journal: IJournal;
  index: number;
  hasFocus?: boolean;
}> = ({ journal, index, hasFocus }) => {
  const domElementRef = useRef<HTMLDivElement>();

  const { renderDialog } = useDialogContext();
  const { user } = useAppContext();

  const journalProperties = useJournalProperties(journal);

  return (
    <div ref={domElementRef} data-testid={`journals-list-item-${index}`}>
      <PageSection key={journal.id} data-testid={journal.id}>
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              flexGrow: 1,
              wordBreak: "break-all",
            }}
          >
            <TitleRow>
              <IconContainer>
                <JournalTypeIcon
                  type={journal.type}
                  style={IconStyle.Overview}
                />
              </IconContainer>

              <ActionLink
                action={ActionFactory.goToJournal(journal.id, hasFocus)}
                style={{ flexGrow: 1 }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "lighter",
                    display: "flex",
                    alignItems: "center",
                    lineHeight: 1,
                    marginTop: "-3px",
                  }}
                >
                  <ReadonlyTitleRow
                    entity={journal}
                    title={journal.name}
                    hasFocus={hasFocus}
                  />
                </Typography>
              </ActionLink>
            </TitleRow>
            <ListItemFooterRow
              hasFocus={hasFocus}
              properties={journalProperties}
              actions={getCommonActions(journal, hasFocus, user, renderDialog)}
            />
          </Box>
        </Box>
      </PageSection>
    </div>
  );
};

const TitleRow = styled("div")`
  display: flex;
`;

const IconContainer = styled("span")`
  padding-right: ${(p) => p.theme.spacing(2)};
`;
