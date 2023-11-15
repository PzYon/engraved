import React from "react";
import { IJournal } from "../../serverApi/IJournal";
import { FormatDate } from "../common/FormatDate";
import { Users } from "../common/Users";
import { Properties } from "../common/Properties";
import { styled } from "@mui/material";
import { Favorite } from "./Favorite";
import {
  getAllExceptOwner,
  getOwner,
  getRoleForUser,
} from "../../serverApi/IUserPermissions";
import { useAppContext } from "../../AppContext";

export const JournalProperties: React.FC<{ journal: IJournal }> = ({
  journal,
}) => {
  const { user } = useAppContext();

  const owner = getOwner(journal.permissions);
  const allExceptOwner = getAllExceptOwner(journal.permissions);
  const userIsOwner = owner?.id === user.id;

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
            node: getRoleForUser(user.id, journal.permissions),
          },
          {
            key: "owned-by",
            node: <Users users={[owner]} />,
            label: "Owned by",
            hideWhen: () => userIsOwner,
          },
          {
            key: "shared-with",
            node: <Users users={allExceptOwner} />,
            hideWhen: () => !allExceptOwner.length,
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
