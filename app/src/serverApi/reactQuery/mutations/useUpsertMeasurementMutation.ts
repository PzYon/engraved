import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../../queryKeysFactory";
import { IUpsertMeasurementCommand } from "../../commands/IUpsertMeasurementCommand";
import { ServerApi } from "../../ServerApi";
import { useAppContext } from "../../../AppContext";
import { IMeasurement } from "../../IMeasurement";
import { IMetric } from "../../IMetric";

export const useUpsertMeasurementMutation = (
  metric: IMetric,
  measurement: IMeasurement,
  onSaved?: () => void
) => {
  const { setAppAlert } = useAppContext();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.updateMeasurement(metric.id, measurement?.id),

    mutationFn: async (variables: { command: IUpsertMeasurementCommand }) => {
      await ServerApi.upsertMeasurement(
        variables.command,
        metric.type.toLowerCase()
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
