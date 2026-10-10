import { StorageWrapper } from "../../util/StorageWrapper";

export interface IScratchpadDraft {
  userId: string;
  content: string;
  // The saved version the draft was written on top of, so that it can still be
  // told apart from what has been saved elsewhere once it is picked up again.
  baseEditedOn: string | undefined;
}

const storage = new StorageWrapper(window.localStorage);

const key = "engraved::scratchpad-draft";

// What has been typed but not saved yet, so that neither a reload nor a failed
// save loses it. Only ever one draft, for whoever signed in last.
export class ScratchpadDraftStorage {
  static get(userId: string): IScratchpadDraft | undefined {
    const draft = storage.getValue<IScratchpadDraft>(key);
    return draft?.userId === userId ? draft : undefined;
  }

  static set(draft: IScratchpadDraft) {
    storage.setValue(key, draft);
  }

  static clear() {
    storage.setValue(key, null);
  }
}
