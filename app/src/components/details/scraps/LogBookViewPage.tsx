import React from "react";
import { JournalPageTitle } from "../JournalPageTitle";
import { getCommonJournalActions } from "../../overview/getCommonJournalActions";
import { Page } from "../../layout/pages/Page";
import { ListOfScraps } from "./ListOfScraps";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { JournalSubRoutes } from "../../overview/journals/JournalSubRoutes";
import { useJournalViewState } from "./useJournalViewState";

export const LogBookViewPage: React.FC = () => {
  const { journal, scraps, user, activeItemId, setActiveItemId } =
    useJournalViewState();

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
