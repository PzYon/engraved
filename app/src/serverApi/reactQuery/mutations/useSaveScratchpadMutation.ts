import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { IScratchpad } from "../../IScratchpad";

export const useSaveScratchpadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.scratchpad(),

    mutationFn: (variables: {
      content: string;
      lastKnownEditedOn: string | undefined;
    }) =>
      ServerApi.saveScratchpad(variables.content, variables.lastKnownEditedOn),

    // A failed save, a conflict above all, is handled by whoever saves (see
    // ScratchpadSession) rather than by replacing the page with an error.
    throwOnError: false,

    onSuccess: (result, variables) => {
      queryClient.setQueryData<IScratchpad>(queryKeysFactory.scratchpad(), {
        content: variables.content,
        editedOn: result.editedOn,
      });
    },
  });
};
