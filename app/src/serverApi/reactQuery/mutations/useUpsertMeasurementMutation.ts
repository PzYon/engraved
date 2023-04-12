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

    onMutate: (variables) => {
      if (measurement?.id) {
        updateExistingMeasurementInCache(variables.command);
      }
    },

    onSuccess: async () => {
      setAppAlert({
        title: `${measurement?.id ? "Updated" : "Added"} measurement`,
        type: "success",
      });

      onSaved?.();
    },

    onError: (error) => {
      setAppAlert({
        title: "Failed to upsert measurement",
        message: error.toString(),
        type: "error",
      });
    },

    onSettled: async () => {
      await queryClient.invalidateQueries(queryKeysFactory.metrics());
    },
  });

  function updateExistingMeasurementInCache(
    command: IUpsertMeasurementCommand
  ) {
    queryClient.setQueryData(
      queryKeysFactory.measurements(metricId, {}, {}),
      (measurements: IMeasurement[]) =>
        measurements.map((m) =>
          m.id === measurement.id ? createCacheMeasurement(m, command) : m
        )
    );
  }

  function createCacheMeasurement(
    measurement: IMeasurement,
    command: IUpsertMeasurementCommand
  ) {
    return {
      ...measurement,
      ...command,
      dateTime: new Date().toString(),
    };
  }
};
