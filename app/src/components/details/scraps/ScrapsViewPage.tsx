import React, { useEffect, useState } from "react";
import { useJournalContext } from "../JournalContext";
import { JournalPageTitle } from "../JournalPageTitle";
import { getCommonJournalActions } from "../../overview/getCommonJournalActions";
import { Page } from "../../layout/pages/Page";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { useAppContext } from "../../../AppContext";
import { ScrapToc } from "./ScrapToc";
import { ScrapList } from "./ScrapList";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { JournalSubRoutes } from "../../overview/journals/JournalSubRoutes";

export const ScrapsViewPage: React.FC = () => {
  const { journal, entries: scraps, setDateConditions } = useJournalContext();
  const { user } = useAppContext();

  const [showToc, setShowToc] = useState(true);
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
      documentTitle={journal.name ?? ""}
      actions={[
        ActionFactory.getToc(() => setShowToc(!showToc), !showToc),
        ...getCommonJournalActions(journal, !activeItemId, user),
      ]}
      pageActionRoutes={<JournalSubRoutes journal={journal} />}
    >
      {showToc ? <ScrapToc entries={scraps as IScrapEntry[]} /> : null}

      <ScrapList
        scraps={scraps as IScrapEntry[]}
        journal={journal}
        user={user}
        onActiveItemChange={setActiveItemId}
      />
    </Page>
  );
};
