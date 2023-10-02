import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { IGetActivitiesQueryResult } from "../../IGetActivitiesQueryResult";
import { JournalType } from "../../JournalType";

export const useActivitiesQuery = (
  searchText?: string,
  journalTypes?: JournalType[],
) => {
  const { data: activities } = useQuery<IGetActivitiesQueryResult>({
    queryKey: queryKeysFactory.activities(searchText, journalTypes),

    queryFn: () => ServerApi.getActivities(searchText, journalTypes),
  });

  return activities;
};
