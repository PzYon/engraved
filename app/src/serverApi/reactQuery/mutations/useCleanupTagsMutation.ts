import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCleanupTagsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.modifyUser(),

    mutationFn: (variables: { isDryRun: boolean }) =>
      ServerApi.cleanupUserTags(variables.isDryRun),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeysFactory.modifyUser(),
      });
    },
  });
};
