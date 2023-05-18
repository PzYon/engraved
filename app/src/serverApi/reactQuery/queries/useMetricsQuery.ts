import { useQuery } from "@tanstack/react-query";
import { IMetric } from "../../IMetric";
import { queryKeysFactory } from "../../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

export const useMetricsQuery = (searchText?: string) => {
  const { data } = useQuery<IMetric[]>({
    queryKey: queryKeysFactory.metrics(searchText),

    queryFn: () => ServerApi.getMetrics(searchText),
  });

  return data;
};
