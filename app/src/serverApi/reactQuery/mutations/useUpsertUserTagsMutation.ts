import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { useAppContext } from "../../../AppContext";

export const useUpdateUserTagsMutation = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAppContext();

  return useMutation({
    mutationKey: queryKeysFactory.modifyUser(),

    mutationFn: (variables: { tagNames: string[] }) =>
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

  async function reloadUser() {
    await queryClient.invalidateQueries({
      queryKey: queryKeysFactory.modifyUser(),
    });
    const updatedUser = await ServerApi.getCurrentUser();
    setUser(updatedUser);
  }
};
