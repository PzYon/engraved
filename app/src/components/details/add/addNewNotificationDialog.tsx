import { ParseableDate } from "../edit/ParseableDate";
import React, { useState } from "react";
import { JournalSelector } from "../../common/JournalSelector";
import { getPermissionsForUser } from "../../overview/useJournalPermissions";
import { UserRole } from "../../../serverApi/UserRole";
import { useAppContext } from "../../../AppContext";
import { styled } from "@mui/material";
import { useUpsertEntryMutation } from "../../../serverApi/reactQuery/mutations/useUpsertEntryMutation";
import { JournalType } from "../../../serverApi/JournalType";
import { IParsedDate } from "../edit/parseDate";
import { IUpsertScrapsEntryCommand } from "../../../serverApi/commands/IUpsertScrapsEntryCommand";
import { ActionIconButton } from "../../common/actions/ActionIconButton"; // todo:
import { SaveOutlined } from "@mui/icons-material";

// todo:
// - some print selection from FunkyDate -> user should easily see, what's going on
// - journal selector
// - what type do we select? md vs list.

export const AddNewNotificationDialog: React.FC<{
  onSuccess?: () => void;
}> = ({ onSuccess }) => {
  const { user } = useAppContext();
  const [journalId, setJournalId] = useState("");
  const [parsed, setParsed] = useState<IParsedDate>({});

  const upsertEntryMutation = useUpsertEntryMutation(
    journalId,
    JournalType.Scraps,
    null,
    null,
    onSuccess,
  );

  return (
    <Host>
      <JournalSelector
        label={"Add to journal"}
        selectedJournalId={journalId}
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
      <ParseableDate sx={{ pt: 2 }} onChange={setParsed} onSelect={save} />
      <ActionIconButton
        action={{
          key: "add",
          onClick: save,
          label: "Save",
          isDisabled: !parsed.date,
          icon: <SaveOutlined fontSize="small" />,
        }}
      />
    </Host>
  );

  function save() {
    upsertEntryMutation.mutate({
      command: {
        title: parsed.text,
        journalId: journalId,
        schedule: {
          nextOccurrence: parsed.date,
        },
      } as IUpsertScrapsEntryCommand,
    });
  }
};

const Host = styled("div")``;
