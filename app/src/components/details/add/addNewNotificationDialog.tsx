import { DateParser } from "../edit/DateParser";
import React, { useState } from "react";
import { JournalSelector } from "../../common/JournalSelector";
import { getPermissionsForUser } from "../../overview/useJournalPermissions";
import { UserRole } from "../../../serverApi/UserRole";
import { useAppContext } from "../../../AppContext";
import { styled } from "@mui/material";

// todo:
// - some print selection from FunkyDate -> user should easily see, what's going on
// - journal selector
// - what type do we select? md vs list.

export const AddNewNotificationDialog: React.FC<{
  onSuccess?: () => void;
}> = () => {
  const { user } = useAppContext();
  const [journalId, setJournalId] = useState("");

  return (
    <Host>
      <JournalSelector
        label={"Add to journal"}
        filterJournals={(journals) =>
          journals.filter((j) => {
            const permissions = getPermissionsForUser(j.permissions, user);
            return (
              permissions.userRole === UserRole.Owner ||
              permissions.userRole === UserRole.Writer
            );
          })
        }
        onChange={(journal) => setJournalId(journal.id)}
      />
      <DateParser
        sx={{ pt: 2 }}
        onSelect={(x) => {
          console.log(x);
          console.log(journalId);
        }}
        onChange={(x) => {
          console.log(x);
        }}
      />
    </Host>
  );
};

const Host = styled("div")``;
