import { useMutation } from "@tanstack/react-query";
import { queryKeysFactory } from "../../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { ICommandResult } from "../../ICommandResult";
import { MetricType } from "../../MetricType";
import { useAppContext } from "../../../AppContext";

export const useAddMetricMutation = (
  name: string,
  description: string,
  metricType: MetricType,
  onAdded: (result: ICommandResult) => Promise<void>
) => {
  const { setAppAlert } = useAppContext();

  return useMutation({
    mutationKey: queryKeysFactory.addMetric(),
    mutationFn: () => ServerApi.addMetric(name, description, metricType),
    onSuccess: async (result: ICommandResult) => {
      await onAdded(result);

      setAppAlert({
        title: `Added metric ${name}`,
        type: "success",
      });
    },
    onError: (error: Error) =>
      setAppAlert({
        title: "Failed to add metric",
        message: error.message,
        type: "error",
      }),
  });
};
