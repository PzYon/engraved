import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

export const useDeleteMeasurementMutation = (
  metricId: string,
  measurementId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.deleteMeasurement(metricId, measurementId),

    mutationFn: () => ServerApi.deleteEntry(measurementId),

    onSuccess: async () =>
      await queryClient.invalidateQueries(queryKeysFactory.journal(metricId)),
  });
};
