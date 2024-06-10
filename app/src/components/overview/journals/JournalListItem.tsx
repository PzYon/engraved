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

import { JournalIconWrapper } from "./JournalIconWrapper";

export const JournalListItem: React.FC<{
  journal: IJournal;
  index: number;
  hasFocus?: boolean;
  giveFocus?: () => void;
}> = ({ journal, index, hasFocus, giveFocus }) => {
  const domElementRef = useRef<HTMLDivElement>();

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
              <JournalIconWrapper
                journal={journal}
                iconStyle={IconStyle.Small}
              />
            </IconContainer>
            <ReadonlyTitle
              entity={journal}
              title={journal.name}
              hasFocus={hasFocus}
              onClick={ActionFactory.goToJournal(journal.id, hasFocus)}
            />
          </TitleRow>
          <ListItemFooterRow
            hasFocus={hasFocus}
            properties={journalProperties}
            actions={getCommonJournalActions(
              journal,
              hasFocus,
              user,
              false,
              true,
            )}
          />
          <JournalSubRoutes journal={journal} giveFocus={giveFocus} />
        </Box>
      </Box>
    </div>
  );
};

const TitleRow = styled("div")`
  display: flex;
`;

const IconContainer = styled("span")`
  padding-right: ${(p) => p.theme.spacing(2)};
  padding-top: 4px;
`;
