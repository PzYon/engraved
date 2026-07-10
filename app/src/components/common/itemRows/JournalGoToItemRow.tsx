import React from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { JournalType } from "../../../serverApi/JournalType";
import { GoToItemRow } from "./GoToItemRow";
import { JournalIcon } from "../../overview/journals/JournalIcon";
import { IconStyle } from "../IconStyle";
import { ActionFactory } from "../actions/ActionFactory";
import { ActionIconButton } from "../actions/ActionIconButton";
import { DeviceWidth, useDeviceWidth } from "../useDeviceWidth";
import { isTypeThatCanShowAddEntryRow } from "../../../util/journalUtils";

export const JournalGoToItemRow: React.FC<{
  journal: IJournal;
  hasFocus: boolean;
  onClick?: () => void;
}> = ({ journal, hasFocus, onClick }) => {
  const deviceWidth = useDeviceWidth();

  return (
    <GoToItemRow
      url={`/journals/details/${journal.id}`}
      onClick={onClick}
      hasFocus={hasFocus}
      icon={<JournalIcon journal={journal} iconStyle={IconStyle.Small} />}
      renderAtEnd={() => {
        return journal.type !== JournalType.Scraps ? (
          <ActionIconButton
            action={
              deviceWidth === DeviceWidth.Normal &&
              isTypeThatCanShowAddEntryRow(journal.type)
                ? ActionFactory.goToJournal(journal.id ?? "", false)
                : ActionFactory.addEntry(journal, false, () => {}, true)
            }
          />
        ) : null;
      }}
    >
      {`${journal.name}`}
    </GoToItemRow>
  );
};
