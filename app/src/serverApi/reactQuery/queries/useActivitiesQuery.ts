import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { IGetActivitiesQueryResult } from "../../IGetActivitiesQueryResult";
import { MetricType } from "../../MetricType";

export const useActivitiesQuery = (
  searchText?: string,
  metricTypes?: MetricType[]
) => {
  const { data: activities } = useQuery<IGetActivitiesQueryResult>({
    queryKey: queryKeysFactory.activities(searchText, metricTypes),

    queryFn: () => ServerApi.getActivities(searchText, metricTypes),
  });

  return activities;
};
