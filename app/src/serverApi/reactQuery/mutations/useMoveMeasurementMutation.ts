import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerApi } from "../../ServerApi";
import { useAppContext } from "../../../AppContext";
import { queryKeysFactory } from "../queryKeysFactory";

export const useMoveMeasurementMutation = (
  entryId: string,
  journalId: string,
  onSaved?: () => void,
) => {
  const { setAppAlert } = useAppContext();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.moveMeasurement(entryId, journalId),

    mutationFn: async (variables: { targetMetricId: string }) => {
      await ServerApi.moveEntry(entryId, variables.targetMetricId);
    },

    onSuccess: async (_, variables) => {
      setAppAlert({
        title: `Successfully moved measurement.`,
        type: "success",
      });

      await queryClient.invalidateQueries(
        queryKeysFactory.journal(variables.targetMetricId),
      );

      await queryClient.invalidateQueries(queryKeysFactory.journal(journalId));

      onSaved?.();
    },

    onError: (error) => {
      setAppAlert({
        title: "Failed to upsert entryId",
        message: error.toString(),
        type: "error",
      });
    },

    onSettled: async () => {
      await queryClient.invalidateQueries(
        queryKeysFactory.journals(undefined, undefined),
      );
    },
  });
};
