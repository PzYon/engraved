import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IMetric } from "../../IMetric";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { MetricType } from "../../MetricType";

export const useMetricsQuery = (
  searchText?: string,
  metricTypes?: MetricType[]
) => {
  const queryClient = useQueryClient();

  const { data } = useQuery<IMetric[]>({
    queryKey: queryKeysFactory.metrics(searchText, metricTypes),

    queryFn: () => ServerApi.getMetrics(searchText, metricTypes),

    onSuccess: (loadedMetrics) => {
      for (const metric of loadedMetrics) {
        queryClient.setQueryData(
          queryKeysFactory.metrics(metric.id, metricTypes),
          () => metric
        );
      }
    },
  });

  return data;
};
