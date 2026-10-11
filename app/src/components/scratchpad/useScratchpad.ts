import { useEffect, useRef } from "react";
import { useScratchpadQuery } from "../../serverApi/reactQuery/queries/useScratchpadQuery";
import { useSaveScratchpadMutation } from "../../serverApi/reactQuery/mutations/useSaveScratchpadMutation";
import { StorageWrapper } from "../../util/StorageWrapper";

const saveDelayMs = 2000;

// What has been typed but not saved yet, so that neither a reload nor a failed
// save loses it. While there is a draft, it is shown instead of what is saved
// and saved over it.
const draftStorage = new StorageWrapper(window.localStorage);
const draftKey = "engraved::scratchpad-draft";

function getDraft() {
  return draftStorage.getValue<string>(draftKey);
}

// Unless more has been typed while it was saved.
function clearDraftIfSaved(savedContent: string) {
  if (getDraft() === savedContent) {
    draftStorage.setValue(draftKey, null);
  }
}

export const useScratchpad = () => {
  const scratchpad = useScratchpadQuery();
  const { mutate: save } = useSaveScratchpadMutation();
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // a draft left over from last time
  useEffect(() => {
    const draft = getDraft();
    if (draft !== undefined) {
      save(draft, { onSuccess: () => clearDraftIfSaved(draft) });
    }
  }, [save]);

  const savedContent =
    scratchpad === undefined ? undefined : (scratchpad?.content ?? "");

  return {
    isLoaded: savedContent !== undefined,
    savedContent,
    content: getDraft() ?? savedContent ?? "",
    edit: (content: string) => {
      draftStorage.setValue(draftKey, content);

      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(
        () => save(content, { onSuccess: () => clearDraftIfSaved(content) }),
        saveDelayMs,
      );
    },
  };
};
