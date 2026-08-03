import { useQueries } from "@tanstack/react-query";
import { ServerApi } from "../serverApi/ServerApi";
import { queryKeysFactory } from "../serverApi/reactQuery/queryKeysFactory";

// Read URLs are signed and expire, but SasExpiry guarantees at least an hour of life: the expiry is
// rounded up to a full hour from fifteen minutes ahead of now, so the shortest one ever issued still
// lasts just over sixty minutes. Caching for less than that is therefore safe without reading the
// expiry off the URL, and it is what keeps a scrap with several images from asking again on every
// render.
const staleTime = 45 * 60 * 1000;

// One query per id rather than one for all of them: ids repeat across scraps - the same image placed
// in two of them, a scrap re-rendered in a list and then opened - and per-id keys let those share a
// single cache entry. If this ever turns into too many requests, the answer is a batch endpoint, not
// a coarser key.
export function useFileUrls(fileIds: string[]): Record<string, string> {
  return useQueries({
    queries: fileIds.map((fileId) => ({
      queryKey: queryKeysFactory.fileUrl(fileId),
      queryFn: () => ServerApi.getFileUrl(fileId),
      staleTime,
      gcTime: staleTime,
    })),

    combine: (results) =>
      Object.fromEntries(
        results
          .map((result, index) => [fileIds[index], result.data] as const)
          .filter((entry): entry is readonly [string, string] => !!entry[1]),
      ),
  });
}
