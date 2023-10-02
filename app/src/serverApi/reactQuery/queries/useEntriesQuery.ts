import { useAppContext } from "../../../AppContext";
import { useQuery } from "@tanstack/react-query";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { ApiError } from "../../ApiError";
import { IDateConditions } from "../../../components/details/JournalDetailsContext";

export const useEntriesQuery = (
  journalId: string,
  dateConditions: IDateConditions,
  attributeValues: Record<string, string[]>,
) => {
  const { setAppAlert } = useAppContext();

  const { data: measurements } = useQuery({
    queryKey: queryKeysFactory.entries(
      journalId,
      dateConditions,
      attributeValues,
    ),

    queryFn: () =>
      dateConditions
        ? ServerApi.getEntries(journalId, attributeValues, dateConditions)
        : Promise.resolve([]),

    onError: (e: ApiError) => {
      setAppAlert({
        title: "Error loading measurements",
        message: e.message,
        type: "error",
      });
    },
  });

  return measurements;
};
