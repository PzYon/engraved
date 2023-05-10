import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

export const useActivitiesQuery = (searchText?: string) => {
  const { data: activities } = useQuery({
    queryKey: queryKeysFactory.activities(searchText),

    queryFn: () => ServerApi.getActivities(searchText),
  });

  return activities;
};
