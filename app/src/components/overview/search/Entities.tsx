import React from "react";
import { usePageContext } from "../../layout/pages/PageContext";
import { useSearchEntitiesQuery } from "../../../serverApi/reactQuery/queries/useSearchEntitiesQuery";
import { ISearchEntitiesResult } from "../../../serverApi/ISearchEntitiesResult";
import { NoResultsFound } from "../../common/search/NoResultsFound";
import { IEntry } from "../../../serverApi/IEntry";
import { JournalListItem } from "../journals/JournalListItem";
import { IJournal } from "../../../serverApi/IJournal";
import { OverviewList } from "../overviewList/OverviewList";
import { EntryListItem } from "../entries/EntryListItem";
import { getScheduleForUser } from "../scheduled/scheduleUtils";
import { useAppContext } from "../../../AppContext";
import { addDays, isBefore } from "date-fns";

export const Entities: React.FC<{ isSchedule?: boolean }> = ({
  isSchedule,
}) => {
  const { user } = useAppContext();
  const { searchText } = usePageContext();
  const queryResult: ISearchEntitiesResult = useSearchEntitiesQuery(
    searchText,
    isSchedule,
  );

  if (!queryResult) {
    return null;
  }

  if (!queryResult.entities.length && (searchText || isSchedule)) {
    return <NoResultsFound hideTryAgain={isSchedule} />;
  }

  return (
    <>
      <OverviewList
        items={queryResult.entities.map((e) => e.entity)}
        filterItem={(i) =>
          !isSchedule ||
          isBefore(
            getScheduleForUser(i, user.id).nextOccurrence,
            addDays(new Date(), 3),
          )
        }
        renderItem={(item, index, hasFocus, giveFocus) => {
          // this is a temporary hack! should be something like:
          // if (item.entityType === "Entry") {
          if (!(item as IJournal).type) {
            return (
              <EntryListItem
                key={item.id}
                index={index}
                hasFocus={hasFocus}
                giveFocus={giveFocus}
                entry={item as IEntry}
                journals={queryResult.journals}
              />
            );
          }

          return (
            <JournalListItem
              key={item.id}
              index={index}
              hasFocus={hasFocus}
              journal={item as IJournal}
            />
          );
        }}
      ></OverviewList>
    </>
  );
};
