import React from "react";
import { useAppContext } from "../../AppContext";
import { ActionIconButton } from "../common/actions/ActionIconButton";
import { Star, StarOutline } from "@mui/icons-material";
import { useAddJournalToFavoritesMutation } from "../../serverApi/reactQuery/mutations/useAddJournalToFavoritesMutation";
import { useRemoveJournalFromFavoritesMutation } from "../../serverApi/reactQuery/mutations/useRemoveJournalFromFavoritesMutation";

export const Starred: React.FC<{ journalId: string }> = ({ journalId }) => {
  const { user } = useAppContext();

  const addMutation = useAddJournalToFavoritesMutation(journalId);
  const removeMutation = useRemoveJournalFromFavoritesMutation(journalId);

  if (user.favoriteJournalIds.indexOf(journalId) > -1) {
    return (
      <ActionIconButton
        action={{
          icon: <Star fontSize="small" />,
          label: "Unlike",
          key: "unlike",
          onClick: () => removeMutation.mutate(),
        }}
      />
    );
  }

  return (
    <ActionIconButton
      action={{
        icon: <StarOutline fontSize="small" />,
        label: "Like",
        key: "like",
        onClick: () => addMutation.mutate(),
      }}
    />
  );
};
