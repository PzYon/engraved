import { useAppContext } from "../../../AppContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { IMetric } from "../../IMetric";
import { MetricType } from "../../MetricType";

export const useEditMetricMutation = (
  metric: IMetric,
  onSuccess?: () => void
) => {
  const { setAppAlert } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.editMetric(metric.id),

    mutationFn: async () => {
      await ServerApi.editMetric(
        metric.id,
        metric.name,
        metric.description,
        metric.notes,
        metric.attributes,
        metric.thresholds,
        metric.customProps?.uiSettings
      );
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries(queryKeysFactory.metric(metric.id));
      onSuccess?.();
    },

    onError: (error) => {
      setAppAlert({
        title: `Failed to edit ${
          metric.type === MetricType.Notes ? "note" : "metric"
        }`,
        message: error.toString(),
        type: "error",
      });
    },
  });
};
