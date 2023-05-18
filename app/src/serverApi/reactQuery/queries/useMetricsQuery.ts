import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IMetric } from "../../IMetric";
import { queryKeysFactory } from "../../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

export const useMetricsQuery = (searchText?: string) => {
  const queryClient = useQueryClient();

  const { data } = useQuery<IMetric[]>({
    queryKey: queryKeysFactory.metrics(searchText),

    queryFn: () => ServerApi.getMetrics(searchText),

    onSuccess: (loadedMetrics) => {
      for (const metric of loadedMetrics) {
        queryClient.setQueryData(
          queryKeysFactory.metrics(metric.id),
          () => metric
        );
      }
    },
  });

  return data;
};
