import React, { useState } from "react";
import { Button } from "@mui/material";
import { useMoveEntryMutation } from "../../../serverApi/reactQuery/mutations/useMoveEntryMutation";
import { useNavigate } from "react-router-dom";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { JournalSelector } from "../../common/JournalSelector";
import { UserRole } from "../../../serverApi/UserRole";
import { getPermissionsForUser } from "../../overview/journals/useJournalPermissions";
import { useAppContext } from "../../../AppContext";
import { DialogFormButtonContainer } from "../../common/FormButtonContainer";
import { useItemAction } from "../../common/actions/itemActionHook";

export const MoveScrapAction: React.FC<{ entry: IScrapEntry }> = ({
  entry,
}) => {
  const navigate = useNavigate();
  const { closeAction } = useItemAction();

  const { user } = useAppContext();

  const [targetJournalId, setTargetJournalId] = useState<string>(undefined);

  const mutation = useMoveEntryMutation(entry.id, entry.parentId, () => {
    navigate(`/journals/${targetJournalId}/`);
  });

  if (!entry) {
    return null;
  }

  return (
    <>
      <JournalSelector
        label={"Move to journal"}
        onChange={(journal) => setTargetJournalId(journal?.id)}
        filterJournals={(journals) =>
          journals.filter((j) => {
            if (j.id === entry.parentId) {
              return false;
            }

            const permissions = getPermissionsForUser(j.permissions, user);
            return (
              permissions.userRole === UserRole.Owner ||
              permissions.userRole === UserRole.Writer
            );
          })
        }
      />
      <DialogFormButtonContainer>
        <Button variant={"outlined"} onClick={closeAction}>
          Cancel
        </Button>
        <Button
          disabled={!targetJournalId}
          variant="contained"
          onClick={() => {
            mutation.mutate({ targetJournalId: targetJournalId });
          }}
        >
          Move
        </Button>
      </DialogFormButtonContainer>
    </>
  );
};
