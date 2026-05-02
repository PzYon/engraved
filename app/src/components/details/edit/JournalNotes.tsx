import React, { useState } from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { useEditJournalMutation } from "../../../serverApi/reactQuery/mutations/useEditJournalMutation";
import { RichTextEditor } from "../../common/RichTextEditor";
import { Markdown } from "../scraps/markdown/Markdown";
import { ActionFactory } from "../../common/actions/ActionFactory";

export const JournalNotes: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const editJournalMutation = useEditJournalMutation(journal.id);
  const [isEditMode, setIsEditMode] = useState(!journal.notes);
  const [notes, setNotes] = useState(journal.notes ?? "");

  if (isEditMode) {
    return (
      <RichTextEditor
        key={journal.id}
        initialValue={notes}
        setValue={setNotes}
        showFormattingOptions={true}
        editModeActions={[
          ActionFactory.save(
            async () => {
              await editJournalMutation.mutateAsync({
                journal: {
                  ...journal,
                  notes,
                },
              });
              setIsEditMode(false);
            },
            false,
            false,
          ),
          ActionFactory.cancel(() => {
            setNotes(journal.notes ?? "");
            setIsEditMode(false);
          }),
          null,
        ]}
      />
    );
  }

  return (
    <div
      onClick={(e) => {
        if (e.detail === 2) {
          setIsEditMode(true);
        }
      }}
    >
      <Markdown value={notes} />
    </div>
  );
};
