import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export const useCleanupTagsMutation = () => {
  const [isDryRun] = useState(true);

  return useMutation({
    mutationKey: queryKeysFactory.modifyUser(),
    mutationFn: () => ServerApi.cleanupUserTags(isDryRun),
  });
};
