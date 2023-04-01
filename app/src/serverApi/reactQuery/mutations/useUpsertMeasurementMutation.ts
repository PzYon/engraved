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

    onSuccess: async (_, variables) => {
      setAppAlert({
        title: `${measurement?.id ? "Updated" : "Added"} measurement`,
        type: "success",
      });

      onSaved?.();

      if (metricType !== MetricType.Scraps || !measurement?.id) {
        return;
      }

      queryClient.setQueriesData(
        {
          queryKey: queryKeysFactory.measurements(metricId, {}, {}),
          exact: true,
        },
        (measurements: IMeasurement[]) =>
          measurements.map((m) => {
            if (m.id === measurement.id) {
              m.notes = variables.command.notes;
              m.dateTime = new Date().toString();
            }

            return m;
          })
      );

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
