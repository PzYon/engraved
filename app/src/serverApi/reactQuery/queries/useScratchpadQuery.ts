import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

export const useScratchpadQuery = () => {
  const { data } = useQuery({
    queryKey: queryKeysFactory.scratchpad(),

    queryFn: () => ServerApi.getScratchpad(),
  });

  return data;
};
