import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

export const useApiAdminUsersQuery = () => {
  const { data } = useQuery({
    queryKey: queryKeysFactory.adminUsers(),

    queryFn: () => ServerApi.getAdminUsersOverview(),
  });

  return data;
};
