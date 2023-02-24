import { useQuery } from "@tanstack/react-query";
import { IMetric } from "../../IMetric";
import { queryKeysFactory } from "../../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

export const useMetricsQuery = () => {
  const { data } = useQuery<IMetric[]>({
    queryKey: queryKeysFactory.metrics(),

    queryFn: () => ServerApi.getMetrics(),
  });

  return data;
};
