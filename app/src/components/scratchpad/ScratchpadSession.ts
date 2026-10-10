import { IScratchpad } from "../../serverApi/IScratchpad";
import { ScratchpadDraftStorage } from "./ScratchpadDraftStorage";

export type ScratchpadStatus =
  "loading" | "saved" | "unsaved" | "saving" | "failed";

interface IScratchpadState {
  content: string;
  // The saved version the content is based on.
  baseEditedOn: string | undefined;
  isDirty: boolean;
  status: ScratchpadStatus;
  // A version saved elsewhere while there were unsaved changes here. Nothing is
  // saved until the user has decided which of the two to keep.
  conflict: IScratchpad | undefined;
  // Counts the times the content was replaced by something other than typing,
  // as an editor only takes its content when it is created.
  revision: number;
}

interface ILocalScratchpad {
  content: string;
  baseEditedOn: string | undefined;
  isDirty: boolean;
}

type Reconciliation = "unchanged" | "adopt" | "conflict";

// What to do with a version that comes from the server.
export function reconcile(
  local: ILocalScratchpad,
  server: IScratchpad,
): Reconciliation {
  // Covers the version the local content is based on coming back as well as an
  // older one, e.g. from a request that was already under way when a save went
  // out.
  if (!isNewer(server.editedOn, local.baseEditedOn)) {
    return "unchanged";
  }

  if (!local.isDirty || local.content === server.content) {
    return "adopt";
  }

  return "conflict";
}

function isNewer(editedOn: string | undefined, than: string | undefined) {
  if (!editedOn) {
    return false;
  }

  return !than || Date.parse(editedOn) > Date.parse(than);
}

export class ConflictError extends Error {}

interface IScratchpadSessionDependencies {
  userId: string;
  // Resolves with the editedOn of the saved version, rejects with a
  // ConflictError if the scratchpad has been saved since lastKnownEditedOn.
  save: (
    content: string,
    lastKnownEditedOn: string | undefined,
  ) => Promise<string>;
  // A save was rejected because of a newer version, which has to be fetched to
  // show it to the user. It comes back through receiveServerVersion.
  loadServerVersion: () => void;
  saveDelayMs: number;
}

// Keeps what is typed in sync with the server: saves a while after typing has
// stopped, keeps unsaved changes as a draft on the device and makes the user
// decide when they collide with changes saved elsewhere. Not tied to React, so
// the flow can be followed step by step.
export class ScratchpadSession {
  private state: IScratchpadState;
  private readonly listeners = new Set<() => void>();
  private saveTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(private readonly dependencies: IScratchpadSessionDependencies) {
    const draft = ScratchpadDraftStorage.get(dependencies.userId);

    this.state = {
      content: draft?.content ?? "",
      baseEditedOn: draft?.baseEditedOn,
      isDirty: !!draft,
      status: "loading",
      conflict: undefined,
      revision: 0,
    };
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getState = () => this.state;

  receiveServerVersion(server: IScratchpad) {
    const isFirst = this.state.status === "loading";

    // A save under way decides on its own what the content is based on.
    if (this.state.status === "saving") {
      return;
    }

    switch (reconcile(this.state, server)) {
      case "adopt":
        this.adopt(server);
        return;

      case "conflict":
        this.update({
          conflict: server,
          status: isFirst ? "unsaved" : this.state.status,
        });
        return;

      case "unchanged":
        if (isFirst) {
          this.update({ status: this.state.isDirty ? "unsaved" : "saved" });
          // a draft left over from last time
          this.scheduleSave(0);
        }
    }
  }

  edit(content: string) {
    if (content === this.state.content) {
      return;
    }

    this.update({ content, isDirty: true, status: "unsaved" });
    this.scheduleSave(this.dependencies.saveDelayMs);
  }

  clear() {
    this.edit("");
    this.update({ revision: this.state.revision + 1 });
  }

  keepMine() {
    const { conflict } = this.state;
    if (!conflict) {
      return;
    }

    this.update({ conflict: undefined, baseEditedOn: conflict.editedOn });
    this.scheduleSave(0);
  }

  takeTheirs() {
    const { conflict } = this.state;
    if (!conflict) {
      return;
    }

    this.adopt(conflict);
  }

  // What has not been saved yet is not left to the draft alone, as nobody
  // would see it on another device until the scratchpad is opened here again.
  dispose() {
    if (this.saveTimer !== undefined) {
      clearTimeout(this.saveTimer);
      this.saveTimer = undefined;
      void this.save();
    }
  }

  private adopt(version: IScratchpad) {
    const isContentReplaced = version.content !== this.state.content;

    this.update({
      content: version.content,
      baseEditedOn: version.editedOn,
      isDirty: false,
      status: "saved",
      conflict: undefined,
      revision: isContentReplaced
        ? this.state.revision + 1
        : this.state.revision,
    });
  }

  private scheduleSave(delayMs: number) {
    if (this.saveTimer !== undefined) {
      clearTimeout(this.saveTimer);
    }

    this.saveTimer = setTimeout(() => {
      this.saveTimer = undefined;
      void this.save();
    }, delayMs);
  }

  private async save() {
    const { content, baseEditedOn, isDirty, status, conflict } = this.state;

    // A save under way schedules the next one itself once it is done.
    if (!isDirty || conflict || status === "saving") {
      return;
    }

    this.update({ status: "saving" });

    try {
      const editedOn = await this.dependencies.save(content, baseEditedOn);

      const isChangedMeanwhile = this.state.content !== content;

      this.update({
        baseEditedOn: editedOn,
        isDirty: isChangedMeanwhile,
        status: isChangedMeanwhile ? "unsaved" : "saved",
      });

      if (isChangedMeanwhile) {
        this.scheduleSave(this.dependencies.saveDelayMs);
      }
    } catch (error) {
      if (error instanceof ConflictError) {
        this.update({ status: "unsaved" });
        this.dependencies.loadServerVersion();
        return;
      }

      // Kept as a draft, and tried again with the next change.
      this.update({ status: "failed" });
    }
  }

  private update(changes: Partial<IScratchpadState>) {
    this.state = { ...this.state, ...changes };
    this.storeDraft();
    this.listeners.forEach((listener) => listener());
  }

  private storeDraft() {
    const { content, baseEditedOn, isDirty } = this.state;

    if (isDirty) {
      ScratchpadDraftStorage.set({
        userId: this.dependencies.userId,
        content,
        baseEditedOn,
      });
    } else {
      ScratchpadDraftStorage.clear();
    }
  }
}
