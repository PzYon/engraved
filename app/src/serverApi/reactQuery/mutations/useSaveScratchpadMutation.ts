import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

export const useSaveScratchpadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.scratchpad(),

    mutationFn: (content: string) => ServerApi.saveScratchpad(content),

    // A load that is still under way would bring back the text from before
    // this save.
    onMutate: () =>
      queryClient.cancelQueries({ queryKey: queryKeysFactory.scratchpad() }),

    // A failed save is kept as a draft and tried again (see useScratchpad)
    // rather than replacing the page with an error.
    throwOnError: false,
  });
};
