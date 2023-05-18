import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { IGetActivitiesQueryResult } from "../../IGetActivitiesQueryResult";

export const useActivitiesQuery = (searchText?: string) => {
  const { data: activities } = useQuery<IGetActivitiesQueryResult>({
    queryKey: queryKeysFactory.activities(searchText),

    queryFn: () => ServerApi.getActivities(searchText),
  });

  return activities;
};
