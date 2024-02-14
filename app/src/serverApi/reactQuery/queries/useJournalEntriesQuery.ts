import { useAppContext } from "../../../AppContext";
import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { IDateConditions } from "../../../components/details/JournalContext";
import { useEffect } from "react";

export const useJournalEntriesQuery = (
  journalId: string,
  dateConditions: IDateConditions,
  attributeValues: Record<string, string[]>,
) => {
  const { setAppAlert } = useAppContext();

  const {
    data: entries,
    isError,
    error,
  } = useQuery({
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
  });

  useEffect(() => {
    if (isError) {
      setAppAlert({
        title: "Error loading entries",
        message: error.message,
        type: "error",
      });
    }
  }, [isError, error, setAppAlert]);

  return entries ?? [];
};
