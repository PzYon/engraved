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
  measurementId?: string,
  onSaved?: () => void
) => {
  const { setAppAlert } = useAppContext();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.updateMeasurement(metricId, measurementId),

    mutationFn: async (variables: { command: IUpsertMeasurementCommand }) => {
      await ServerApi.upsertMeasurement(
        variables.command,
        metricType.toLowerCase()
      );
    },

    onMutate: (variables) => {
      if (measurementId) {
        updateExistingMeasurementInCache(variables.command);
      }
    },

    onSuccess: async () => {
      setAppAlert({
        title: `${measurementId ? "Updated" : "Added"} measurement`,
        type: "success",
      });

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
      await queryClient.invalidateQueries(queryKeysFactory.metrics());
    },
  });

  function updateExistingMeasurementInCache(
    command: IUpsertMeasurementCommand
  ) {
    queryClient.setQueryData(
      queryKeysFactory.measurements(metricId, {}, {}),
      (measurements: IMeasurement[]) => {
        if (!measurements) {
          return measurements;
        }

        return measurements.map((m) =>
          m.id === measurementId ? createCacheMeasurement(m, command) : m
        );
      }
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
