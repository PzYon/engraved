import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { ScratchpadSession, shouldAdopt } from "./ScratchpadSession";

const saveDelayMs = 1000;
const draftKey = "engraved::scratchpad-draft";

const v1 = "2026-10-01T08:00:00.000Z";
const v2 = "2026-10-01T08:01:00.000Z";
const v3 = "2026-10-01T08:02:00.000Z";

function getDraft() {
  const draft = localStorage.getItem(draftKey);
  return draft === null ? undefined : JSON.parse(draft);
}

describe("shouldAdopt", () => {
  const clean = { content: "a", baseEditedOn: v1, isDirty: false };
  const dirty = { content: "mine", baseEditedOn: v1, isDirty: true };

  it("ignores the version the content is based on", () => {
    expect(shouldAdopt(clean, { content: "a", editedOn: v1 })).toBe(false);
  });

  it("ignores a version older than the one the content is based on", () => {
    expect(
      shouldAdopt(
        { ...clean, baseEditedOn: v2 },
        { content: "old", editedOn: v1 },
      ),
    ).toBe(false);
  });

  it("ignores a scratchpad that has never been saved", () => {
    expect(shouldAdopt(clean, { content: "" })).toBe(false);
  });

  it("adopts a newer version without unsaved changes", () => {
    expect(shouldAdopt(clean, { content: "b", editedOn: v2 })).toBe(true);
  });

  it("adopts a newer version with the same content as the unsaved one", () => {
    expect(shouldAdopt(dirty, { content: "mine", editedOn: v2 })).toBe(true);
  });

  it("adopts the first saved version when nothing is known yet", () => {
    expect(
      shouldAdopt(
        { content: "", baseEditedOn: undefined, isDirty: false },
        { content: "b", editedOn: v1 },
      ),
    ).toBe(true);
  });

  it("keeps unsaved changes over a newer version, as they are saved last", () => {
    expect(shouldAdopt(dirty, { content: "theirs", editedOn: v2 })).toBe(false);
  });
});

describe("ScratchpadSession", () => {
  let save: Mock<(content: string) => Promise<string>>;

  function createSession() {
    return new ScratchpadSession({ save, saveDelayMs });
  }

  async function runTimers(ms = saveDelayMs) {
    await vi.advanceTimersByTimeAsync(ms);
  }

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    save = vi.fn().mockResolvedValue(v2);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with what has been saved", () => {
    const session = createSession();

    session.receiveServerVersion({ content: "saved", editedOn: v1 });

    expect(session.getState()).toMatchObject({
      content: "saved",
      baseEditedOn: v1,
      isDirty: false,
      isLoaded: true,
    });
  });

  it("saves once typing has stopped for a while", async () => {
    const session = createSession();
    session.receiveServerVersion({ content: "", editedOn: v1 });

    session.edit("h");
    await runTimers(saveDelayMs / 2);
    session.edit("hi");
    await runTimers(saveDelayMs / 2);

    expect(save).not.toHaveBeenCalled();
    expect(session.getState().isDirty).toBe(true);

    await runTimers();

    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith("hi");
    expect(session.getState()).toMatchObject({
      baseEditedOn: v2,
      isDirty: false,
    });
  });

  it("keeps unsaved changes as a draft until they are saved", async () => {
    const session = createSession();
    session.receiveServerVersion({ content: "", editedOn: v1 });

    session.edit("draft");

    expect(getDraft()).toBe("draft");

    await runTimers();

    expect(getDraft()).toBeUndefined();
  });

  it("saves what has been typed during a save with the next one", async () => {
    let resolveFirstSave: (editedOn: string) => void = () => {};
    save.mockImplementationOnce(
      () => new Promise<string>((resolve) => (resolveFirstSave = resolve)),
    );
    save.mockResolvedValueOnce(v3);

    const session = createSession();
    session.receiveServerVersion({ content: "", editedOn: v1 });

    session.edit("first");
    await runTimers();
    expect(session.getState().isSaving).toBe(true);

    session.edit("first and more");
    resolveFirstSave(v2);
    await runTimers(0);

    expect(session.getState()).toMatchObject({
      baseEditedOn: v2,
      isDirty: true,
      isSaving: false,
    });
    expect(getDraft()).toBe("first and more");

    await runTimers();

    expect(save).toHaveBeenLastCalledWith("first and more");
    expect(session.getState()).toMatchObject({
      baseEditedOn: v3,
      isDirty: false,
    });
  });

  it("keeps the draft when a save fails and tries again with the next change", async () => {
    save.mockRejectedValueOnce(new Error("offline"));

    const session = createSession();
    session.receiveServerVersion({ content: "", editedOn: v1 });

    session.edit("important");
    await runTimers();

    expect(session.getState()).toMatchObject({
      isDirty: true,
      isSaving: false,
    });
    expect(getDraft()).toBe("important");

    session.edit("important!");
    await runTimers();

    expect(save).toHaveBeenLastCalledWith("important!");
    expect(session.getState().isDirty).toBe(false);
    expect(getDraft()).toBeUndefined();
  });

  it("saves a draft left over from last time, even over a newer version", async () => {
    localStorage.setItem(draftKey, JSON.stringify("left over"));

    const session = createSession();
    session.receiveServerVersion({ content: "saved elsewhere", editedOn: v1 });

    expect(session.getState()).toMatchObject({
      content: "left over",
      isDirty: true,
      isLoaded: true,
    });

    await runTimers(0);

    expect(save).toHaveBeenCalledWith("left over");
  });

  it("takes over what has been saved elsewhere when nothing is unsaved", () => {
    const session = createSession();
    session.receiveServerVersion({ content: "old", editedOn: v1 });
    const { revision } = session.getState();

    session.receiveServerVersion({ content: "from elsewhere", editedOn: v2 });

    expect(session.getState()).toMatchObject({
      content: "from elsewhere",
      baseEditedOn: v2,
      revision: revision + 1,
    });
  });

  it("keeps unsaved changes and saves them over what has been saved elsewhere", async () => {
    const session = createSession();
    session.receiveServerVersion({ content: "old", editedOn: v1 });

    session.edit("mine");
    session.receiveServerVersion({ content: "theirs", editedOn: v2 });

    expect(session.getState().content).toBe("mine");

    await runTimers();

    expect(save).toHaveBeenCalledWith("mine");
  });

  it("saves pending changes right away when disposed", async () => {
    const session = createSession();
    session.receiveServerVersion({ content: "", editedOn: v1 });

    session.edit("leaving");
    session.dispose();
    await runTimers(0);

    expect(save).toHaveBeenCalledWith("leaving");
  });
});
