import { useEffect, useState, useSyncExternalStore } from "react";
import { useScratchpadQuery } from "../../serverApi/reactQuery/queries/useScratchpadQuery";
import { useSaveScratchpadMutation } from "../../serverApi/reactQuery/mutations/useSaveScratchpadMutation";
import { ScratchpadSession } from "./ScratchpadSession";

const saveDelayMs = 1000;

export const useScratchpadSession = () => {
  const serverScratchpad = useScratchpadQuery();
  const { mutateAsync: save } = useSaveScratchpadMutation();

  const [session] = useState(
    () =>
      new ScratchpadSession({
        save: async (content) => (await save({ content })).editedOn,
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
