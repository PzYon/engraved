import React, { useEffect, useRef } from "react";
import { IScrapEntry } from "../../../../serverApi/IScrapEntry";
import { IFileRef } from "../../../../serverApi/IFileRef";

// Files are held on the scrap itself rather than in state of their own, so that they take part in
// the dirty check, the draft storage and the upsert command without any of those needing to know
// about files specifically. This keeps the add/remove plumbing out of the provider.
export function useScrapFiles(
  files: IFileRef[] | undefined,
  setScrapToRender: React.Dispatch<React.SetStateAction<IScrapEntry>>,
  isEditMode: boolean,
  saveSilently: () => Promise<void>,
) {
  // A file can be added without entering edit mode, where there is no save button - so it has to
  // persist itself, or the bytes would be uploaded and the reference to them lost on navigating
  // away. It cannot save inline in addFile: the save reads the scrap from state, which does not hold
  // the new file until the update has been applied. So the save waits for that, which is what this
  // effect keys on. A ref rather than state, because the flag must not itself cause a render.
  const shouldPersistRef = useRef(false);

  useEffect(() => {
    if (!shouldPersistRef.current) {
      return;
    }

    shouldPersistRef.current = false;

    void saveSilently();
  }, [files, saveSilently]);

  return {
    addFile: (file: IFileRef) => {
      shouldPersistRef.current = !isEditMode;

      setScrapToRender((prev) => ({
        ...prev,
        files: [...(prev.files ?? []), file],
      }));
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
