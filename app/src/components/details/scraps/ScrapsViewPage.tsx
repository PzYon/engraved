import React, { useState } from "react";
import { JournalPageTitle } from "../JournalPageTitle";
import { getCommonJournalActions } from "../../overview/getCommonJournalActions";
import { Page } from "../../layout/pages/Page";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { ScrapToc } from "./ScrapToc";
import { ListOfScraps } from "./ListOfScraps";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { JournalSubRoutes } from "../../overview/journals/JournalSubRoutes";
import { useJournalViewState } from "./useJournalViewState";

export const ScrapsViewPage: React.FC = () => {
  const { journal, scraps, user, activeItemId, setActiveItemId } =
    useJournalViewState();

  const [showToc, setShowToc] = useState(true);

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

      <ListOfScraps
        scraps={scraps as IScrapEntry[]}
        journal={journal}
        user={user}
        onActiveItemChange={setActiveItemId}
      />
    </Page>
  );
};
