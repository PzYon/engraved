import { IScratchpad } from "../../serverApi/IScratchpad";
import { StorageWrapper } from "../../util/StorageWrapper";

interface IScratchpadState {
  content: string;
  // When the version the content is based on was saved.
  baseEditedOn: string | undefined;
  isDirty: boolean;
  isLoaded: boolean;
  isSaving: boolean;
  // Counts the times the content was replaced by something other than typing,
  // as an editor only takes its content when it is created.
  revision: number;
}

interface ILocalScratchpad {
  content: string;
  baseEditedOn: string | undefined;
  isDirty: boolean;
}

// Whether a version that comes from the server replaces what is shown. With
// unsaved changes it does not: the last save wins, and those are saved next.
export function shouldAdopt(local: ILocalScratchpad, server: IScratchpad) {
  // Covers the version the content is based on coming back as well as an older
  // one, e.g. from a request that was already under way when a save went out.
  if (!isNewer(server.editedOn, local.baseEditedOn)) {
    return false;
  }

  return !local.isDirty || local.content === server.content;
}

function isNewer(editedOn: string | undefined, than: string | undefined) {
  if (!editedOn) {
    return false;
  }

  return !than || Date.parse(editedOn) > Date.parse(than);
}

// What has been typed but not saved yet, so that neither a reload nor a failed
// save loses it.
const draftStorage = new StorageWrapper(window.localStorage);
const draftKey = "engraved::scratchpad-draft";

interface IScratchpadSessionDependencies {
  // Resolves with the editedOn of the saved version.
  save: (content: string) => Promise<string>;
  saveDelayMs: number;
}

// Keeps what is typed in sync with the server: saves a while after typing has
// stopped, keeps unsaved changes as a draft on the device and takes over what
// has been saved elsewhere unless there is something unsaved here. Not tied to
// React, so the flow can be followed step by step.
export class ScratchpadSession {
  private state: IScratchpadState;
  private readonly listeners = new Set<() => void>();
  private saveTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(private readonly dependencies: IScratchpadSessionDependencies) {
    const draft = draftStorage.getValue<string>(draftKey);

    this.state = {
      content: draft ?? "",
      baseEditedOn: undefined,
      isDirty: draft !== undefined,
      isLoaded: false,
      isSaving: false,
      revision: 0,
    };
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getState = () => this.state;

  receiveServerVersion(server: IScratchpad) {
    // A save under way decides on its own what the content is based on.
    if (this.state.isSaving) {
      return;
    }

    if (shouldAdopt(this.state, server)) {
      this.adopt(server);
      return;
    }

    if (!this.state.isLoaded) {
      this.update({ isLoaded: true });
      // a draft left over from last time
      this.scheduleSave(0);
    }
  }

  // Called through the session useScratchpadSession returns, which fallow does not follow.
  // fallow-ignore-next-line unused-class-member
  edit(content: string) {
    if (content === this.state.content) {
      return;
    }

    this.update({ content, isDirty: true });
    this.scheduleSave(this.dependencies.saveDelayMs);
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
      isLoaded: true,
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
    const { content, isDirty, isSaving } = this.state;

    // A save under way schedules the next one itself once it is done.
    if (!isDirty || isSaving) {
      return;
    }

    this.update({ isSaving: true });

    try {
      const editedOn = await this.dependencies.save(content);

      const isChangedMeanwhile = this.state.content !== content;

      this.update({
        baseEditedOn: editedOn,
        isDirty: isChangedMeanwhile,
        isSaving: false,
      });

      if (isChangedMeanwhile) {
        this.scheduleSave(this.dependencies.saveDelayMs);
      }
    } catch {
      // Kept as a draft, and tried again with the next change.
      this.update({ isSaving: false });
    }
  }

  private update(changes: Partial<IScratchpadState>) {
    this.state = { ...this.state, ...changes };
    draftStorage.setValue(
      draftKey,
      this.state.isDirty ? this.state.content : null,
    );
    this.listeners.forEach((listener) => listener());
  }
}
