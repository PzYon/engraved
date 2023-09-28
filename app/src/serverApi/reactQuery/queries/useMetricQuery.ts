import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { IMetric } from "../../IMetric";

export const useMetricQuery = (metricId: string) => {
  const queryClient = useQueryClient();

  const { data: metric } = useQuery({
    queryKey: queryKeysFactory.metric(metricId),

    queryFn: () => ServerApi.getMetric(metricId),

    onSuccess: (loadedMetric) => {
      queryClient.setQueriesData(
        {
          queryKey: queryKeysFactory.metrics(undefined, undefined),
          exact: true,
        },
        (metrics: IMetric[]) =>
          metrics.map((m) => (m.id === loadedMetric.id ? loadedMetric : m)),
      );
    },
  });

  return metric;
};
