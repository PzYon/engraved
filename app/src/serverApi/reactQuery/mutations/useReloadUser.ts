import { useQueryClient } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { useAppContext } from "../../../AppContext";

// Invalidates the current-user query, refetches the user and pushes it into app
// context. Shared by the mutations that change user-scoped data (favorites,
// tags, and journal edits that touch tags).
export const useReloadUser = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAppContext();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: queryKeysFactory.modifyUser(),
    });
    const updatedUser = await ServerApi.getCurrentUser();
    setUser(updatedUser);
  };
};
