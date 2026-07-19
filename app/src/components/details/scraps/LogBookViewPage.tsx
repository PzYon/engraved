import React, { useEffect, useState } from "react";
import { useJournalContext } from "../JournalContext";
import { JournalPageTitle } from "../JournalPageTitle";
import { getCommonJournalActions } from "../../overview/getCommonJournalActions";
import { Page } from "../../layout/pages/Page";
import { ListOfScraps } from "./ListOfScraps";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { useAppContext } from "../../../AppContext";
import { JournalSubRoutes } from "../../overview/journals/JournalSubRoutes";

export const LogBookViewPage: React.FC = () => {
  const { journal, entries: scraps, setDateConditions } = useJournalContext();
  const { user } = useAppContext();

  const [activeItemId, setActiveItemId] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    // we need to set date conditions in order for data to be loaded
    setDateConditions({});
  }, [setDateConditions]);

  if (!journal) {
    return null;
  }

  return (
    <Page
      title={<JournalPageTitle journal={journal} />}
      documentTitle={journal.name}
      actions={getCommonJournalActions(journal, !activeItemId, user)}
      pageActionRoutes={<JournalSubRoutes journal={journal} />}
    >
      <ListOfScraps
        scraps={scraps as IScrapEntry[]}
        journal={journal}
        user={user}
        onActiveItemChange={setActiveItemId}
        showDaysBetween={true}
      />
    </Page>
  );
};
