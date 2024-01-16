import React from "react";
import { IJournal } from "../../serverApi/IJournal";
import { DateFormat, FormatDate } from "../common/FormatDate";
import { Users } from "../common/Users";
import { Properties } from "../common/Properties";
import { styled } from "@mui/material";
import { Favorite } from "./Favorite";
import { useJournalPermissions } from "./useJournalPermissions";
import { UserRole } from "../../serverApi/UserRole";
import { DeviceWidth, useDeviceWidth } from "../common/useDeviceWidth";

export const JournalProperties: React.FC<{
  journal: IJournal;
  position?: "list" | "details";
}> = ({ journal, position }) => {
  const journalPermissions = useJournalPermissions(journal.permissions);

  const paddingX =
    useDeviceWidth() === DeviceWidth.Small && position === "details" ? 2 : 0;

  return (
    <Host sx={{ px: paddingX }}>
      <Properties
        properties={[
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
          {
            key: "schedule",
            node: () => (
              <FormatDate
                value={journal.schedule?.nextOccurrence}
                dateFormat={DateFormat.relativeToNow}
              />
            ),
            label: "Scheduled",
            hideWhen: () => !journal.schedule?.nextOccurrence,
            isHighlighted: true,
          },
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
        ]}
      />
    </Host>
  );
};

const Host = styled("div")`
  margin-top: ${(p) => p.theme.spacing(2)};
`;
