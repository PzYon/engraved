import React, { useRef } from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { Box, styled } from "@mui/material";
import { useJournalProperties } from "./useJournalProperties";
import { getCommonJournalActions } from "../getCommonJournalActions";
import { ListItemFooterRow } from "../ListItemFooterRow";
import { ReadonlyTitle } from "../ReadonlyTitle";
import { useAppContext } from "../../../AppContext";
import { JournalSubRoutes } from "./JournalSubRoutes";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { IconStyle } from "../../common/IconStyle";
import { JournalIcon } from "./JournalIcon";

export const JournalListItem: React.FC<{
  journal: IJournal;
  index: number;
  hasFocus?: boolean;
}> = ({ journal, index, hasFocus }) => {
  const domElementRef = useRef<HTMLDivElement>(undefined);

  const { user } = useAppContext();

  const journalProperties = useJournalProperties(journal);

  return (
    <div ref={domElementRef} data-testid={`journals-list-item-${index}`}>
      <Box sx={{ display: "flex" }}>
        <Box
          sx={{
            flexGrow: 1,
            wordBreak: "break-all",
          }}
        >
          <TitleRow>
            <IconContainer>
              <JournalIcon journal={journal} iconStyle={IconStyle.Small} />
            </IconContainer>
            <ReadonlyTitle
              entity={journal}
              title={journal.name}
              hasFocus={hasFocus}
              onClickAction={ActionFactory.goToJournal(journal.id, hasFocus)}
            />
          </TitleRow>
          <ListItemFooterRow
            hasFocus={hasFocus}
            properties={journalProperties}
            actions={getCommonJournalActions(journal, hasFocus, user)}
          />
          {hasFocus ? <JournalSubRoutes journal={journal} /> : null}
        </Box>
      </Box>
    </div>
  );
};

const TitleRow = styled("div")`
  display: flex;
`;

const IconContainer = styled("span")`
  padding-top: 5px;
  padding-right: ${(p) => p.theme.spacing(2)};
  display: flex;
  align-items: center;
`;
