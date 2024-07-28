import React, { useEffect, useState } from "react";
import { Scrap } from "./Scrap";
import { SelfImprovementOutlined } from "@mui/icons-material";
import { useJournalContext } from "../JournalContext";
import { JournalPageTitle } from "../JournalPageTitle";
import { getCommonJournalActions } from "../../overview/getCommonJournalActions";
import { Page } from "../../layout/pages/Page";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { GenericEmptyPlaceholder } from "../../common/search/GenericEmptyPlaceholder";
import { useAppContext } from "../../../AppContext";
import { ScrapToc } from "./ScrapToc";
import { IEntity } from "../../../serverApi/IEntity";
import { compareAsc } from "date-fns";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { OverviewList } from "../../overview/overviewList/OverviewList";
import { getScheduleForUser } from "../../overview/scheduled/scheduleUtils";
import { JournalSubRoutes } from "../../overview/journals/JournalSubRoutes";

export const ScrapsViewPage: React.FC = () => {
  const { journal, entries: scraps, setDateConditions } = useJournalContext();
  const { user } = useAppContext();

  const [showToc, setShowToc] = useState(true);

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
      actions={[
        ActionFactory.getToc(() => setShowToc(!showToc)),
        ...getCommonJournalActions(journal, false, user),
      ]}
      pageActionRoutes={
        <JournalSubRoutes journal={journal} noBorderForActions={true} />
      }
    >
      {showToc ? <ScrapToc entries={scraps as IScrapEntry[]} /> : null}

      {scraps.length ? (
        <OverviewList
          items={scraps.sort(getCompareFn(user.id))}
          renderItem={(item, _, hasFocus, giveFocus) => (
            <Scrap
              key={item.id + getScheduleForUser(item, user.id).nextOccurrence}
              journal={journal}
              propsRenderStyle={"generic"}
              scrap={item as IScrapEntry}
              hasFocus={hasFocus}
              giveFocus={giveFocus}
            />
          )}
        />
      ) : null}

      {!scraps.length ? (
        <GenericEmptyPlaceholder
          icon={SelfImprovementOutlined}
          message={"Nothing here..."}
        />
      ) : null}
    </Page>
  );
};

function getCompareFn(userId: string) {
  return (a: IEntity, b: IEntity) => {
    const nextOccurrenceA = getScheduleForUser(a, userId).nextOccurrence;
    const nextOccurrenceB = getScheduleForUser(b, userId).nextOccurrence;

    if (nextOccurrenceA && nextOccurrenceB) {
      return compareAsc(new Date(nextOccurrenceA), new Date(nextOccurrenceB));
    }

    if (nextOccurrenceA) {
      return -1;
    }

    if (nextOccurrenceB) {
      return 1;
    }

    return 0;
  };
}
