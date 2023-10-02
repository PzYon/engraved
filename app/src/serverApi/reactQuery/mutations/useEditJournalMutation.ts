import { useAppContext } from "../../../AppContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { IJournal } from "../../IJournal";

export const useEditJournalMutation = (metricId: string) => {
  const { setAppAlert } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.editMetric(metricId),

    mutationFn: async (variables: {
      metric: IJournal;
      onSuccess?: () => void;
    }) => {
      const metric = variables.metric;

      await ServerApi.editMetric(
        metricId,
        metric.name,
        metric.description,
        metric.notes,
        metric.attributes,
        metric.thresholds,
        metric.customProps?.uiSettings,
      );
    },

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries(queryKeysFactory.journal(metricId));
      variables.onSuccess?.();
    },

    onError: (error) =>
      setAppAlert({
        title: `Failed to edit metric`,
        message: error.toString(),
        type: "error",
      }),
  });
};
