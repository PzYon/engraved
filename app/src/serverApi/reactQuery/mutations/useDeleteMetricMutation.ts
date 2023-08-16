import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { useAppContext } from "../../../AppContext";

export const useDeleteMetricMutation = (metricId: string) => {
  const { setAppAlert } = useAppContext();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.deleteMetric(metricId),

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mutationFn: async (_: { onSuccess: () => Promise<void> }) =>
      await ServerApi.deleteMetric(metricId),

    onSuccess: async (_, variables) => {
      await variables.onSuccess();

      setAppAlert({
        title: `Successfully deleted metric.`,
        type: "success",
      });

      await queryClient.invalidateQueries(queryKeysFactory.metric(metricId));
      await queryClient.invalidateQueries(queryKeysFactory.metrics());
    },
  });
};
