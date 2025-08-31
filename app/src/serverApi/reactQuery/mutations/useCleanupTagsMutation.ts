import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { useMutation } from "@tanstack/react-query";

export const useCleanupTagsMutation = (isDryRun: boolean) => {
  return useMutation({
    mutationKey: queryKeysFactory.modifyUser(),
    mutationFn: () => ServerApi.cleanupUserTags(isDryRun),
  });
};
