import React, { useState } from "react";
import { IJournal } from "../../serverApi/IJournal";
import { PageTitle } from "../layout/pages/PageTitle";
import { IconStyle } from "../common/IconStyle";
import { useEditJournalMutation } from "../../serverApi/reactQuery/mutations/useEditJournalMutation";
import { getUiSettings } from "../../util/journalUtils";
import { EmojiPickerWrapper } from "../common/Emoji";
import { JournalIcon } from "../overview/journals/JournalIcon";

export const JournalPageTitle: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const uiSettings = getUiSettings(journal);

  const [, setEmoji] = useState<string>(uiSettings.emoji?.unified);

  const editJournalMutation = useEditJournalMutation(journal.id);

  if (!journal) {
    return null;
  }

  return (
    <PageTitle
      icon={
        <EmojiPickerWrapper
          onEmojiClick={(e) => {
            const updatedJournal = { ...journal };

            uiSettings.emoji = { unified: e };
            updatedJournal.customProps.uiSettings = JSON.stringify(uiSettings);

            editJournalMutation.mutate({ journal: updatedJournal });

            setEmoji(e);
          }}
          opener={<JournalIcon journal={journal} iconStyle={IconStyle.Large} />}
        />
      }
      title={journal?.name}
    />
  );
};
