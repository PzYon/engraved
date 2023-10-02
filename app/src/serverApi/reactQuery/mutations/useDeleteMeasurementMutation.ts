import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

export const useDeleteMeasurementMutation = (
  journalId: string,
  entryId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.deleteMeasurement(journalId, entryId),

    mutationFn: () => ServerApi.deleteEntry(entryId),

    onSuccess: async () =>
      await queryClient.invalidateQueries(queryKeysFactory.journal(journalId)),
  });
};
