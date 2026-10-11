import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { IScratchpad } from "../../IScratchpad";

export const useSaveScratchpadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.scratchpad(),

    mutationFn: (variables: { content: string }) =>
      ServerApi.saveScratchpad(variables.content),

    // A failed save is kept as a draft and tried again (see ScratchpadSession)
    // rather than replacing the page with an error.
    throwOnError: false,

    onSuccess: (result, variables) => {
      queryClient.setQueryData<IScratchpad>(queryKeysFactory.scratchpad(), {
        content: variables.content,
        editedOn: result.editedOn,
      });
    },
  });
};
