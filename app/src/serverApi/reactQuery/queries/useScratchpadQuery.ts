import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

export const useScratchpadQuery = () => {
  const { data } = useQuery({
    queryKey: queryKeysFactory.scratchpad(),

    queryFn: () => ServerApi.getScratchpad(),

    // The scratchpad is meant for moving text between devices, so coming back
    // to the window has to show what was written on the other one meanwhile.
    refetchOnWindowFocus: "always",
  });

  return data;
};
