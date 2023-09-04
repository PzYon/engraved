import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { IUpsertMeasurementCommand } from "../../commands/IUpsertMeasurementCommand";
import { ServerApi } from "../../ServerApi";
import { useAppContext } from "../../../AppContext";
import { MetricType } from "../../MetricType";

export interface IVariables {
  command: IUpsertMeasurementCommand;
}

export const useUpsertMeasurementMutation = (
  metricId: string,
  metricType: MetricType,
  measurementId?: string,
  onSaved?: () => void
) => {
  const { setAppAlert } = useAppContext();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.updateMeasurement(metricId, measurementId),

    mutationFn: async (variables: IVariables) => {
      await ServerApi.upsertMeasurement(
        variables.command,
        metricType.toLowerCase()
      );
    },

    onSuccess: async () => {
      setAppAlert({
        title: `${measurementId ? "Updated" : "Added"} measurement`,
        type: "success",
      });

      onSaved?.();

      await queryClient.invalidateQueries(queryKeysFactory.metric(metricId));
      await queryClient.invalidateQueries(queryKeysFactory.metrics());
      await queryClient.invalidateQueries(queryKeysFactory.activities());
    },

    onError: (error: unknown) => {
      setAppAlert({
        title: "Failed to upsert measurementId",
        message: error.toString(),
        type: "error",
      });
    },
  });
};
