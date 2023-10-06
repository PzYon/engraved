import { useAppContext } from "../../../AppContext";
import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { ApiError } from "../../ApiError";
import { IDateConditions } from "../../../components/details/JournalDetailsContext";

export const useJournalEntriesQuery = (
  journalId: string,
  dateConditions: IDateConditions,
  attributeValues: Record<string, string[]>,
) => {
  const { setAppAlert } = useAppContext();

  const { data: entries } = useQuery({
    queryKey: queryKeysFactory.journalEntries(
      journalId,
      dateConditions,
      attributeValues,
    ),

    queryFn: () =>
      dateConditions
        ? ServerApi.getJournalEntries(
            journalId,
            attributeValues,
            dateConditions,
          )
        : Promise.resolve([]),

    onError: (e: ApiError) => {
      setAppAlert({
        title: "Error loading entries",
        message: e.message,
        type: "error",
      });
    },
  });

  return entries ?? [];
};
