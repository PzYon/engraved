import React, { useEffect } from "react";
import { Scrap } from "./Scrap";
import SelfImprovementOutlined from "@mui/icons-material/SelfImprovementOutlined";
import { useJournalContext } from "../JournalContext";
import { JournalPageTitle } from "../JournalPageTitle";
import { getCommonJournalActions } from "../../overview/getCommonJournalActions";
import { Page } from "../../layout/pages/Page";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { GenericEmptyPlaceholder } from "../../common/search/GenericEmptyPlaceholder";
import { useAppContext } from "../../../AppContext";
import { OverviewList } from "../../overview/overviewList/OverviewList";
import {
  getScheduleForUser,
  sortEntitiesByDates,
} from "../../overview/scheduled/scheduleUtils";
import { JournalSubRoutes } from "../../overview/journals/JournalSubRoutes";

export const LogBookViewPage: React.FC = () => {
  const { journal, entries: scraps, setDateConditions } = useJournalContext();
  const { user } = useAppContext();

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
      actions={[null, ...getCommonJournalActions(journal, user)]}
      pageActionRoutes={<JournalSubRoutes journal={journal} />}
    >
      {scraps.length ? (
        <OverviewList
          showDaysBetween={true}
          items={sortEntitiesByDates(scraps, user.id)}
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
      ) : (
        <GenericEmptyPlaceholder
          icon={SelfImprovementOutlined}
          message={"Nothing here..."}
        />
      )}
    </Page>
  );
};
