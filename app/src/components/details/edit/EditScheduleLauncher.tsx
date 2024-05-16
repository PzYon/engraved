import { IJournal } from "../../../serverApi/IJournal";
import { useDialogContext } from "../../layout/dialogs/DialogContext";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useJournalContext } from "../JournalContext";
import { useAppContext } from "../../../AppContext";
import { renderEditSchedule } from "./renderEditSchedule";

export const EditScheduleLauncher: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const { renderDialog } = useDialogContext();
  const { entryId } = useParams();
  const { entries } = useJournalContext();
  const { user } = useAppContext();

  const navigate = useNavigate();

  useEffect(() => {
    renderEditSchedule(journal.id, entryId, journal, renderDialog, navigate);
  }, [journal, entryId, entries, navigate, renderDialog, user.id]);

  return null;
};
