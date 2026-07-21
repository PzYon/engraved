import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { useAppContext } from "../../../AppContext";
import { getErrorAlert } from "./getErrorAlert";

export const useDeleteAdminUserMutation = (
  userId: string,
  userName: string,
) => {
  const { setAppAlert } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.deleteAdminUser(userId),

    mutationFn: async () => {
      const { confirmationToken } =
        await ServerApi.requestDeleteUserConfirmation(userId);

      await ServerApi.deleteAdminUser(userId, confirmationToken);
    },

    onSuccess: async () => {
      setAppAlert({
        title: `Successfully deleted user ${userName}.`,
        type: "success",
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeysFactory.adminUsers(),
      });
    },

    onError: (error) =>
      setAppAlert(getErrorAlert(`Failed to delete user ${userName}`, error)),
  });
};
