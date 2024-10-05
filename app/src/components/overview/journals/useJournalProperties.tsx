import { IJournal } from "../../../serverApi/IJournal";
import { Users } from "../../common/Users";
import { Favorite } from "../Favorite";
import { useJournalPermissions } from "./useJournalPermissions";
import { UserRole } from "../../../serverApi/UserRole";
import { getScheduleProperty } from "../scheduled/scheduleUtils";
import { IPropertyDefinition } from "../../common/IPropertyDefinition";
import { FormatDate } from "../../common/FormatDate";
import { useAppContext } from "../../../AppContext";
import { Link } from "react-router-dom";
import { styled } from "@mui/material";

export const useJournalProperties = (
  journal: IJournal,
): IPropertyDefinition[] => {
  const journalPermissions = useJournalPermissions(journal?.permissions);
  const { user } = useAppContext();

  if (!journal) {
    return [];
  }

  const tags = user.tags.filter((t) => t.journalIds.indexOf(journal.id) > -1);

  return [
    {
      key: "favorite",
      node: () => <Favorite journalId={journal.id} />,
      label: null,
    },
    {
      key: "edited-on-date",
      node: () => <FormatDate value={journal.editedOn} />,
      label: "Edited",
    },
    getScheduleProperty(journal, user.id),
    {
      key: "description",
      node: () => <>{journal.description}</>,
      hideWhen: () => !journal.description,
      label: null,
    },
    {
      key: "user-role",
      label: "Your are",
      node: () => journalPermissions.userRole,
    },
    {
      key: "owned-by",
      node: () => <Users users={[journalPermissions.owner]} />,
      label: "Owned by",
      hideWhen: () => journalPermissions.userRole === UserRole.Owner,
    },
    {
      key: "shared-with",
      node: () => <Users users={journalPermissions.allExceptOwner} />,
      hideWhen: () => !journalPermissions.allExceptOwner.length,
      label: "Shared with",
    },
    {
      key: "tags",
      label: "Tags",
      hideWhen: () => !tags.length,
      node: () => (
        <TagContainer>
          {tags.map((tag) => (
            <Link key={tag.id} to={`/tags/${tag.id}`}>
              {tag.label}
            </Link>
          ))}
        </TagContainer>
      ),
    },
  ];
};

const TagContainer = styled("div")`
  display: inline-flex;

  a:not(:last-of-type)::after {
    content: ",";
    margin-right: 5px;
  }
`;
