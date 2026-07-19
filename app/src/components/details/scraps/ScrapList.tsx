import React from "react";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { IJournal } from "../../../serverApi/IJournal";
import { IUser } from "../../../serverApi/IUser";
import { OverviewList } from "../../overview/overviewList/OverviewList";
import {
  sortEntitiesByDates,
  getScheduleForUser,
} from "../../overview/scheduled/scheduleUtils";
import { Scrap } from "./Scrap";
import { EntrySubRoutes } from "../../common/entries/EntrySubRoutes";
import { GenericEmptyPlaceholder } from "../../common/search/GenericEmptyPlaceholder";
import SelfImprovementOutlined from "@mui/icons-material/SelfImprovementOutlined";

interface ScrapListProps {
  scraps: IScrapEntry[];
  journal: IJournal;
  user: IUser;
  onActiveItemChange: (id: string | undefined) => void;
  showDaysBetween?: boolean;
}

export const ScrapList: React.FC<ScrapListProps> = ({
  scraps,
  journal,
  user,
  onActiveItemChange,
  showDaysBetween = false,
}) => {
  return scraps.length ? (
    <OverviewList
      showDaysBetween={showDaysBetween}
      items={sortEntitiesByDates(scraps, user.id ?? "")}
      onActiveItemChange={onActiveItemChange}
      renderItem={(item, _, hasFocus, giveFocus) => (
        <React.Fragment
          key={
            (item.id ?? "") +
            getScheduleForUser(item, user.id ?? "").nextOccurrence
          }
        >
          <Scrap
            journal={journal}
            propsRenderStyle={"generic"}
            scrap={item as IScrapEntry}
            hasFocus={hasFocus}
            giveFocus={giveFocus}
          />
          {hasFocus ? <EntrySubRoutes entry={item as IScrapEntry} /> : null}
        </React.Fragment>
      )}
    />
  ) : (
    <GenericEmptyPlaceholder
      icon={SelfImprovementOutlined}
      message={"Nothing here..."}
    />
  );
};
