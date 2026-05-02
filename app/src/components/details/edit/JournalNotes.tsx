import React, { useState } from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { useEditJournalMutation } from "../../../serverApi/reactQuery/mutations/useEditJournalMutation";
import { RichTextEditor } from "../../common/RichTextEditor";
import { Markdown } from "../scraps/markdown/Markdown";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { ActionIconButtonGroup } from "../../common/actions/ActionIconButtonGroup";
import EditOutlined from "@mui/icons-material/EditOutlined";

export const JournalNotes: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const editJournalMutation = useEditJournalMutation(journal.id);
  const [isEditMode, setIsEditMode] = useState(!journal.notes);
  const [notes, setNotes] = useState(journal.notes ?? "");

  const save = async () => {
    await editJournalMutation.mutateAsync({
      journal: {
        ...journal,
        notes,
      },
    });
    setIsEditMode(false);
  };

  const cancel = () => {
    setNotes(journal.notes ?? "");
    setIsEditMode(false);
  };

  if (isEditMode) {
    return (
      <RichTextEditor
        key={journal.id}
        initialValue={notes}
        setValue={setNotes}
        showFormattingOptions={true}
        editModeActions={[
          ActionFactory.save(save, false, false),
          ActionFactory.cancel(cancel),
          null,
        ]}
      />
    );
  }

  return (
    <>
      <ActionIconButtonGroup
        actions={[
          {
            key: "edit-notes",
            label: "Edit notes",
            icon: <EditOutlined fontSize="small" />,
            onClick: () => setIsEditMode(true),
          },
        ]}
      />
      <Markdown value={notes} />
    </>
  );
};
