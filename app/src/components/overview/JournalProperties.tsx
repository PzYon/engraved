import React from "react";
import { IJournal } from "../../serverApi/IJournal";
import { FormatDate } from "../common/FormatDate";
import { Users } from "../common/Users";
import { Properties } from "../common/Properties";
import { styled } from "@mui/material";
import { Favorite } from "./Favorite";
import { getRoleForUser } from "../../serverApi/IUserPermissions";
import { useJournalPermissions } from "./useJournalPermissions";

export const JournalProperties: React.FC<{ journal: IJournal }> = ({
  journal,
}) => {
  const journalPermissions = useJournalPermissions(journal.permissions);

  return (
    <Host>
      <Properties
        properties={[
          {
            key: "favorite",
            node: <Favorite journalId={journal.id} />,
            label: null,
          },
          {
            key: "edited-on-date",
            node: <FormatDate value={journal.editedOn} />,
            label: "Edited",
          },
          {
            key: "user-role",
            label: "Your are",
            node: getRoleForUser(
              journalPermissions.userId,
              journal.permissions,
            ),
          },
          {
            key: "owned-by",
            node: <Users users={[journalPermissions.owner]} />,
            label: "Owned by",
            hideWhen: () => journalPermissions.userIsOwner,
          },
          {
            key: "shared-with",
            node: <Users users={journalPermissions.allExceptOwner} />,
            hideWhen: () => !journalPermissions.allExceptOwner.length,
            label: "Shared with",
          },
          {
            key: "description",
            node: <>{journal.description}</>,
            hideWhen: () => !journal.description,
            label: "Description",
          },
        ]}
      />
    </Host>
  );
};

const Host = styled("div")`
  margin-top: ${(p) => p.theme.spacing(2)};
`;
