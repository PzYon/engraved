import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerApi } from "../../ServerApi";
import { useAppContext } from "../../../AppContext";
import { queryKeysFactory } from "../queryKeysFactory";

export const useMoveMeasurementMutation = (
  measurementId: string,
  metricId: string,
  onSaved?: () => void,
) => {
  const { setAppAlert } = useAppContext();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.moveMeasurement(measurementId, metricId),

    mutationFn: async (variables: { targetMetricId: string }) => {
      await ServerApi.moveMeasurement(measurementId, variables.targetMetricId);
    },

    onSuccess: async (_, variables) => {
      setAppAlert({
        title: `Successfully moved measurement.`,
        type: "success",
      });

      await queryClient.invalidateQueries(
        queryKeysFactory.metric(variables.targetMetricId),
      );

      await queryClient.invalidateQueries(queryKeysFactory.metric(metricId));

      onSaved?.();
    },

    onError: (error) => {
      setAppAlert({
        title: "Failed to upsert measurementId",
        message: error.toString(),
        type: "error",
      });
    },

    onSettled: async () => {
      await queryClient.invalidateQueries(
        queryKeysFactory.metrics(undefined, undefined),
      );
    },
  });
};
