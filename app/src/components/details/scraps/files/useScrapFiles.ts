import React from "react";
import { IScrapEntry } from "../../../../serverApi/IScrapEntry";
import { IFileRef } from "../../../../serverApi/IFileRef";

// Files are held on the scrap itself rather than in state of their own, so that they take part in
// the dirty check, the draft storage and the upsert command without any of those needing to know
// about files specifically. This keeps the add/remove plumbing out of the provider.
export function useScrapFiles(
  setScrapToRender: React.Dispatch<React.SetStateAction<IScrapEntry>>,
  setIsEditMode: (isEditMode: boolean) => void,
) {
  return {
    addFile: (file: IFileRef) => {
      setScrapToRender((prev) => ({
        ...prev,
        files: [...(prev.files ?? []), file],
      }));

      // A file can be added from the footer without being in edit mode, and there would then be no
      // save button and no way to remove it again. Switching makes it an ordinary unsaved edit
      // instead: the chip gets its remove affordance, and the existing save and auto-save paths
      // persist it - no separate handling for files.
      setIsEditMode(true);
    },

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
