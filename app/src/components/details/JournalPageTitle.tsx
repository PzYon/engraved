import React, { useState } from "react";
import { IJournal } from "../../serverApi/IJournal";
import { PageTitle } from "../layout/pages/PageTitle";
import { IconStyle } from "../common/IconStyle";
import { useEditJournalMutation } from "../../serverApi/reactQuery/mutations/useEditJournalMutation";
import { getUiSettings } from "../../util/journalUtils";
import {
  EmojiPickerWrapper,
  JournalIconWrapper,
} from "../overview/journals/Emoji";

export const JournalPageTitle: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const [, setEmoji] = useState<string>(getUiSettings(journal).emoji?.unified);

  const editJournalMutation = useEditJournalMutation(journal.id);

  if (!journal) {
    return null;
  }

  return (
    <PageTitle
      icon={
        <EmojiPickerWrapper
          onEmojiClick={(e) => {
            const uiSettings = getUiSettings(journal);
            if (!uiSettings.emoji) {
              uiSettings.emoji = {
                unified: e,
              };
            } else {
              uiSettings.emoji.unified = e;
            }

            const updatedJournal = { ...journal };
            journal.customProps.uiSettings = JSON.stringify(uiSettings);

            editJournalMutation.mutate({
              journal: updatedJournal,
            });

            setEmoji(e);
          }}
          opener={
            <JournalIconWrapper
              journal={journal}
              iconStyle={IconStyle.PageTitle}
            />
          }
        />
      }
      title={journal?.name}
    />
  );
};
