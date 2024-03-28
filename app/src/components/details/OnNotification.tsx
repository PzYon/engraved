import React from "react";
import { styled } from "@mui/material";
import { IJournal } from "../../serverApi/IJournal";
import { IEntry } from "../../serverApi/IEntry";
import { ActionIconButtonGroup } from "../common/actions/ActionIconButtonGroup";
import { ActionFactory } from "../common/actions/ActionFactory";

export const OnNotification: React.FC<{
  journal: IJournal;
  entry?: IEntry;
  onCancel: () => void;
}> = ({ journal, entry }) => {
  return (
    <div>
      <ActionsContainer>
        <ActionIconButtonGroup
          actions={[
            entry
              ? ActionFactory.deleteEntry(entry)
              : ActionFactory.deleteJournal(journal.id, false),
            entry
              ? ActionFactory.editEntrySchedule(journal.id, entry.id)
              : ActionFactory.editJournalSchedule(journal.id, false),
          ]}
        />
      </ActionsContainer>
    </div>
  );
};

const ActionsContainer = styled("div")`
  display: flex;
`;
