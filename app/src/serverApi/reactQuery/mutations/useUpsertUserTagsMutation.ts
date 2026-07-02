import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { useReloadUser } from "./useReloadUser";

export const useUpdateUserTagsMutation = () => {
  const queryClient = useQueryClient();
  const reloadUser = useReloadUser();

  return useMutation({
    mutationKey: queryKeysFactory.modifyUser(),

    mutationFn: (variables: { tagNames: Record<string, string> }) =>
      ServerApi.updateUserTags(variables.tagNames),

    onSuccess: async () => {
      await Promise.all([
        reloadUser(),
        queryClient.invalidateQueries({
          queryKey: queryKeysFactory.journals(),
        }),
      ]);
    },
  });
};
