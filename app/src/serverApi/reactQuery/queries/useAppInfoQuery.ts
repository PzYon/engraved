import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

export const useAppInfoQuery = () => {
  const { data } = useQuery({
    queryKey: queryKeysFactory.systemInfo(),

    queryFn: () => ServerApi.getSystemInfo(),
  });

  return data;
};
