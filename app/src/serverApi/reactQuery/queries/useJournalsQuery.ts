import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IJournal } from "../../IJournal";
import { queryKeysFactory } from "../queryKeysFactory";
import { ServerApi } from "../../ServerApi";
import { JournalType } from "../../JournalType";

export const useJournalsQuery = (
  searchText?: string,
  metricTypes?: JournalType[],
) => {
  const queryClient = useQueryClient();

  const { data } = useQuery<IJournal[]>({
    queryKey: queryKeysFactory.journals(searchText, metricTypes),

    queryFn: () => ServerApi.getJournals(searchText, metricTypes),

    onSuccess: (loadedMetrics) => {
      for (const metric of loadedMetrics) {
        queryClient.setQueryData(
          queryKeysFactory.journals(metric.id, metricTypes),
          () => metric,
        );
      }
    },
  });

  return data;
};
