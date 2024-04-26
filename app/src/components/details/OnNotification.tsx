import React from "react";
import { styled } from "@mui/material";
import { IJournal } from "../../serverApi/IJournal";
import { IEntry } from "../../serverApi/IEntry";
import { ActionIconButtonGroup } from "../common/actions/ActionIconButtonGroup";
import { ActionFactory } from "../common/actions/ActionFactory";
import { Scrap } from "./scraps/Scrap";
import { IScrapEntry } from "../../serverApi/IScrapEntry";

export const OnNotification: React.FC<{
  journal: IJournal;
  entry?: IEntry;
}> = ({ journal, entry }) => {
  if (entry) {
    return (
      <Scrap
        scrap={entry as IScrapEntry}
        journalName={journal.name}
        hasFocus={true}
        propsRenderStyle={"all"}
      />
    );
  }

  return (
    <ActionsContainer>
      <ActionIconButtonGroup
        actions={[
          ActionFactory.deleteJournal(journal.id, false),
          ActionFactory.editJournalSchedule(journal.id, false),
        ]}
      />
    </ActionsContainer>
  );
};

const ActionsContainer = styled("div")`
  display: flex;
`;
