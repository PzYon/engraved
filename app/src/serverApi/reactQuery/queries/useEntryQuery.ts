import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";

export const useEntryQuery = (entryId: string) => {
  const { data: entry } = useQuery({
    gcTime: 0,

    queryKey: queryKeysFactory.entry(entryId),

    queryFn: () =>
      entryId ? ServerApi.getEntry(entryId) : Promise.resolve(null),
  });

  return entry;
};
