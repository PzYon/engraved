import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

export const useActivitiesQuery = () => {
  const { data: activities } = useQuery({
    queryKey: queryKeysFactory.activities(),

    queryFn: () => ServerApi.getActivities(),
  });

  return activities;
};
