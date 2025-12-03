import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerApi } from "../../ServerApi";
import { useAppContext } from "../../../AppContext";
import { queryKeysFactory } from "../queryKeysFactory";
import { StyledLink } from "./StyledLink";
import { knownQueryParams } from "../../../components/common/actions/searchParamHooks";

export const useMoveEntryMutation = (
  entryId: string,
  journalId: string,
  onSaved?: () => void,
) => {
  const { setAppAlert } = useAppContext();

  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: queryKeysFactory.moveEntry(entryId, journalId),

    mutationFn: async (variables: { targetJournalId: string }) => {
      await ServerApi.moveEntry(entryId, variables.targetJournalId);
    },

    onSuccess: async (_, variables) => {
      const journalUrl = `/journals/details/${variables.targetJournalId}`;
      const actionUrl = `${journalUrl}?${knownQueryParams.selectedItemId}=${entryId}`;

      setAppAlert({
        title: `Moved entry`,
        message: (
          <>
            <StyledLink to={actionUrl}>View</StyledLink> in journal
          </>
        ),
        type: "success",
        relatedEntityId: entryId,
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeysFactory.journal(variables.targetJournalId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeysFactory.journal(journalId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeysFactory.journals(),
        }),
      ]);

      onSaved?.();
    },

    onError: (error) => {
      setAppAlert({
        title: "Failed to move entry",
        message: error.toString(),
        type: "error",
      });
    },
  });
};
