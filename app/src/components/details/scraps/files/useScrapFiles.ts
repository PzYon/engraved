import React from "react";
import { IScrapEntry } from "../../../../serverApi/IScrapEntry";
import { IFileRef } from "../../../../serverApi/IFileRef";

// Files are held on the scrap itself rather than in state of their own, so that they take part in
// the dirty check, the draft storage and the upsert command without any of those needing to know
// about files specifically. This just keeps the add/remove plumbing out of the provider.
export function useScrapFiles(
  setScrapToRender: React.Dispatch<React.SetStateAction<IScrapEntry>>,
) {
  return {
    addFile: (file: IFileRef) =>
      setScrapToRender((prev) => ({
        ...prev,
        files: [...(prev.files ?? []), file],
      })),

    removeFile: (fileId: string) =>
      setScrapToRender((prev) => ({
        ...prev,
        files: (prev.files ?? []).filter((f) => f.id !== fileId),
      })),
  };
}

// Ids only, in order: enough to tell whether the set of files changed, and cheap to compare.
export function getFileIds(entry: { files?: IFileRef[] }) {
  return (entry.files ?? []).map((f) => f.id).join(",");
}
