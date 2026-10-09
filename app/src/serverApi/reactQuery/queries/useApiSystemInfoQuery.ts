import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

// Only feeds the footer: counting all users, journals and entries again on
// every start and every time the window gets the focus is not worth it.
const staleTime = 60 * 60 * 1000;

export const useApiSystemInfoQuery = () => {
  const { data } = useQuery({
    queryKey: queryKeysFactory.systemInfo(),

    queryFn: () => ServerApi.getSystemInfo(),

    staleTime,
  });

  return data;
};
