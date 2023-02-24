import { useMutation } from "@tanstack/react-query";
import { queryKeysFactory } from "../../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

export const useDeleteMetricMutation = (metricId: string) => {
  return useMutation({
    mutationKey: queryKeysFactory.deleteMetric(metricId),

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mutationFn: async (_: { onSuccess: () => Promise<void> }) =>
      await ServerApi.deleteMetric(metricId),

    onSuccess: async (_, variables) => await variables.onSuccess(),
  });
};
