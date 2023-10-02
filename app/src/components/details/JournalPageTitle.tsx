import React from "react";
import { IJournal } from "../../serverApi/IJournal";
import { PageTitle } from "../layout/pages/PageTitle";
import { IconStyle } from "../common/Icon";
import { JournalTypeIcon } from "../common/JournalTypeIcon";

export const JournalPageTitle: React.FC<{ journal: IJournal }> = ({
  journal,
}) => {
  if (!journal) {
    return null;
  }

  return (
    <PageTitle
      icon={
        <JournalTypeIcon type={journal?.type} style={IconStyle.PageTitle} />
      }
      title={journal?.name}
    />
  );
};
