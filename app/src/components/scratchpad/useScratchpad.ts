import { useEffect, useState } from "react";
import { UseMutateFunction } from "@tanstack/react-query";
import { useScratchpadQuery } from "../../serverApi/reactQuery/queries/useScratchpadQuery";
import { useSaveScratchpadMutation } from "../../serverApi/reactQuery/mutations/useSaveScratchpadMutation";
import { StorageWrapper } from "../../util/StorageWrapper";

// What has been typed but not saved yet, so that neither a reload nor a failed
// save loses it. While there is a draft, it is shown instead of what is saved
// and saved over it.
const draftStorage = new StorageWrapper(window.localStorage);
const draftKey = "engraved::scratchpad-draft";

function getDraft() {
  return draftStorage.getValue<string>(draftKey);
}

function saveDraft(
  save: UseMutateFunction<void, Error, string>,
  onSaved: () => void,
) {
  const draft = getDraft();
  if (draft === undefined) {
    return;
  }

  save(draft, {
    onSuccess: () => {
      // unless more has been typed while it was saved
      if (getDraft() === draft) {
        draftStorage.setValue(draftKey, null);
        onSaved();
      }
    },
  });
}

export const useScratchpad = () => {
  const scratchpad = useScratchpadQuery();
  const { mutate: save } = useSaveScratchpadMutation();
  const [draft, setDraft] = useState(getDraft);

  // a draft left over from last time
  useEffect(() => saveDraft(save, () => setDraft(undefined)), [save]);

  const savedContent =
    scratchpad === undefined ? undefined : (scratchpad?.content ?? "");

  return {
    isLoaded: savedContent !== undefined,
    content: draft ?? savedContent ?? "",
    edit: (content: string) => {
      draftStorage.setValue(draftKey, content);
      setDraft(content);
    },
    save: () => saveDraft(save, () => setDraft(undefined)),
  };
};
