import { useEffect, useState, useSyncExternalStore } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../../AppContext";
import { useScratchpadQuery } from "../../serverApi/reactQuery/queries/useScratchpadQuery";
import { useSaveScratchpadMutation } from "../../serverApi/reactQuery/mutations/useSaveScratchpadMutation";
import { queryKeysFactory } from "../../serverApi/reactQuery/queryKeysFactory";
import { ApiError } from "../../serverApi/ApiError";
import { ConflictError, ScratchpadSession } from "./ScratchpadSession";

const saveDelayMs = 1000;

export const useScratchpadSession = () => {
  const { user } = useAppContext();
  const queryClient = useQueryClient();
  const serverScratchpad = useScratchpadQuery();
  const { mutateAsync: save } = useSaveScratchpadMutation();

  const [session] = useState(
    () =>
      new ScratchpadSession({
        userId: user.id ?? "",
        save: async (content, lastKnownEditedOn) => {
          try {
            const result = await save({ content, lastKnownEditedOn });
            return result.editedOn;
          } catch (error) {
            throw error instanceof ApiError && error.status === 409
              ? new ConflictError(error.message)
              : error;
          }
        },
        loadServerVersion: () =>
          queryClient.invalidateQueries({
            queryKey: queryKeysFactory.scratchpad(),
          }),
        saveDelayMs,
      }),
  );

  useEffect(() => () => session.dispose(), [session]);

  useEffect(() => {
    if (serverScratchpad !== undefined) {
      session.receiveServerVersion(serverScratchpad ?? { content: "" });
    }
  }, [serverScratchpad, session]);

  const state = useSyncExternalStore(session.subscribe, session.getState);

  return { session, state };
};
