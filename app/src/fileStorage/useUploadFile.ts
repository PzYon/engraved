import { useQueryClient } from "@tanstack/react-query";
import { IUploadedFile, uploadFile } from "./uploadFile";
import { queryKeysFactory } from "../serverApi/reactQuery/queryKeysFactory";

// Uploads and remembers the read URL that came back with it. Seeding the cache is what lets a
// freshly pasted image appear straight away: asking for a read URL the usual way would 404, because
// that lookup goes through the entry holding the file and nothing holds it until the entry is saved.
export function useUploadFile() {
  const queryClient = useQueryClient();

  return async (journalId: string, file: File): Promise<IUploadedFile> => {
    const uploaded = await uploadFile(journalId, file);

    queryClient.setQueryData(
      queryKeysFactory.fileUrl(uploaded.file.id),
      uploaded.readUrl,
    );

    return uploaded;
  };
}
