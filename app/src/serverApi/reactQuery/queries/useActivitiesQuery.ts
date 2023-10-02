import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { IGetActivitiesQueryResult } from "../../IGetActivitiesQueryResult";
import { JournalType } from "../../JournalType";

export const useActivitiesQuery = (
  searchText?: string,
  metricTypes?: JournalType[],
) => {
  const { data: activities } = useQuery<IGetActivitiesQueryResult>({
    queryKey: queryKeysFactory.activities(searchText, metricTypes),

    queryFn: () => ServerApi.getActivities(searchText, metricTypes),
  });

  return activities;
};
