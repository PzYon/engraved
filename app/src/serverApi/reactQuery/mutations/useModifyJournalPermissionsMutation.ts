import { ServerApi } from "../../ServerApi";
import { useMutation } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { IUpdatePermissions } from "../../IUpdatePermissions";
import { useAppContext } from "../../../AppContext";
import { getErrorAlert } from "./getErrorAlert";

export const useModifyJournalPermissionsMutation = (journalId: string) => {
  const { setAppAlert } = useAppContext();

  return useMutation({
    mutationKey: queryKeysFactory.journal(journalId),

    mutationFn: (variables: { newPermissions: IUpdatePermissions }) =>
      ServerApi.modifyJournalPermissions(journalId, variables.newPermissions),

    onSuccess: () =>
      setAppAlert({
        title: `Modified journal permissions`,
        type: "success",
      }),

    onError: (error) =>
      setAppAlert(getErrorAlert("Failed to modify journal permissions", error)),
  });
};
