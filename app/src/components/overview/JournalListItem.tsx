import React, { useEffect, useRef } from "react";
import { IJournal } from "../../serverApi/IJournal";
import { Box, styled, Typography } from "@mui/material";
import { useJournalProperties } from "./JournalProperties";
import { JournalTypeIcon } from "../common/JournalTypeIcon";
import { IconStyle } from "../common/Icon";
import { PageSection } from "../layout/pages/PageSection";
import { JournalItemWrapper } from "./JournalItemWrapper";
import { Wrapper } from "../common/wrappers/Wrapper";
import { ActionLink } from "../common/actions/ActionLink";
import { ActionFactory } from "../common/actions/ActionFactory";
import { getCommonActions } from "./getCommonActions";
import { useDialogContext } from "../layout/dialogs/DialogContext";
import { ListItemFooterRow } from "./ListItemFooterRow";

export const JournalListItem: React.FC<{
  journal: IJournal;
  index: number;
  addWrapper?: (scrapWrapper: JournalItemWrapper) => void;
  onClick?: () => void;
  isFocused?: boolean;
}> = ({ journal, addWrapper, index, onClick, isFocused }) => {
  const domElementRef = useRef<HTMLDivElement>();

  const { renderDialog } = useDialogContext();

  const journalProperties = useJournalProperties(journal);

  useEffect(() => {
    if (!addWrapper) {
      return;
    }

    addWrapper(new JournalItemWrapper(domElementRef, journal));
  }, [addWrapper, journal]);

  return (
    <Wrapper
      ref={domElementRef}
      tabIndex={index}
      onClick={onClick}
      data-testid={`journals-list-item-${index}`}
    >
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
                action={ActionFactory.goToJournal(journal.id, isFocused)}
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
                  {journal.name}
                </Typography>
              </ActionLink>
            </TitleRow>
            <ListItemFooterRow
              properties={journalProperties}
              actions={getCommonActions(journal, isFocused, renderDialog)}
            />
          </Box>
        </Box>
      </PageSection>
    </Wrapper>
  );
};

const TitleRow = styled("div")`
  display: flex;
`;

const IconContainer = styled("span")`
  padding-right: ${(p) => p.theme.spacing(2)};
`;
