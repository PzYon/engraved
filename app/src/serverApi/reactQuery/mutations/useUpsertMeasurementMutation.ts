import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { IUpsertMeasurementCommand } from "../../commands/IUpsertMeasurementCommand";
import { ServerApi } from "../../ServerApi";
import { useAppContext } from "../../../AppContext";
import { IMeasurement } from "../../IMeasurement";
import { MetricType } from "../../MetricType";

export interface IVariables {
  command: IUpsertMeasurementCommand;
}

export const useUpsertMeasurementMutation = (
  metricId: string,
  metricType: MetricType,
  measurementId?: string,
  onSaved?: () => void,
) => {
  const { setAppAlert } = useAppContext();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.updateMeasurement(metricId, measurementId),

    mutationFn: async (variables: IVariables) => {
      await ServerApi.upsertMeasurement(
        variables.command,
        metricType.toLowerCase(),
      );
    },

    onSuccess: async (_: unknown, variables: IVariables) => {
      setAppAlert({
        title: `${measurementId ? "Updated" : "Added"} measurement`,
        type: "success",
      });

      onSaved?.();

      if (measurementId) {
        updateExistingMeasurementInCache(variables.command);
      }

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

  function updateExistingMeasurementInCache(
    command: IUpsertMeasurementCommand,
  ) {
    queryClient.setQueryData(
      queryKeysFactory.measurements(metricId),
      (measurements: IMeasurement[]) => {
        if (!measurements) {
          return measurements;
        }

        return measurements.map((m) =>
          m.id === measurementId ? createCacheMeasurement(m, command) : m,
        );
      },
    );
  }

  function createCacheMeasurement(
    measurement: IMeasurement,
    command: IUpsertMeasurementCommand,
  ) {
    const editedOn = new Date().toString();
    return {
      ...measurement,
      ...command,
      dateTime: editedOn,
      editedOn: editedOn,
    };
  }
};
