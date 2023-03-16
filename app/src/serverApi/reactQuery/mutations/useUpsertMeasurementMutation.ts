import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../../queryKeysFactory";
import { IUpsertMeasurementCommand } from "../../commands/IUpsertMeasurementCommand";
import { ServerApi } from "../../ServerApi";
import { useAppContext } from "../../../AppContext";
import { IMeasurement } from "../../IMeasurement";
import { MetricType } from "../../MetricType";

export const useUpsertMeasurementMutation = (
  metricId: string,
  metricType: MetricType,
  measurement: IMeasurement,
  onSaved?: () => void
) => {
  const { setAppAlert } = useAppContext();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.updateMeasurement(metricId, measurement?.id),

    mutationFn: async (variables: { command: IUpsertMeasurementCommand }) => {
      await ServerApi.upsertMeasurement(
        variables.command,
        metricType.toLowerCase()
      );
    },

    onSuccess: async () => {
      setAppAlert({
        title: `${measurement?.id ? "Updated" : "Added"} measurement`,
        type: "success",
      });

      onSaved?.();

      await queryClient.invalidateQueries(queryKeysFactory.metrics());
    },

    onError: (error) =>
      setAppAlert({
        title: "Failed to upsert measurement",
        message: error.toString(),
        type: "error",
      }),
  });
};
