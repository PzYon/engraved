import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { JournalType } from "../../JournalType";
import { useAppContext } from "../../../AppContext";

export const useAddJournalMutation = (
  name: string,
  description: string,
  journalType: JournalType,
) => {
  const { setAppAlert } = useAppContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.addJournal(),

    mutationFn: () => ServerApi.addJournal(name, description, journalType),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeysFactory.journals(),
      });

      setAppAlert({
        title: `Added journal ${name}`,
        type: "success",
      });
    },

    onError: (error: Error) =>
      setAppAlert({
        title: "Failed to add journal",
        message: error.message,
        type: "error",
      }),
  });
};
