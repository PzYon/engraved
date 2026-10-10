import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";
import {
  ConflictError,
  reconcile,
  ScratchpadSession,
} from "./ScratchpadSession";
import { ScratchpadDraftStorage } from "./ScratchpadDraftStorage";

const userId = "user-1";
const saveDelayMs = 1000;

const v1 = "2026-10-01T08:00:00.000Z";
const v2 = "2026-10-01T08:01:00.000Z";
const v3 = "2026-10-01T08:02:00.000Z";

describe("reconcile", () => {
  const clean = { content: "a", baseEditedOn: v1, isDirty: false };
  const dirty = { content: "mine", baseEditedOn: v1, isDirty: true };

  it("ignores the version the content is based on", () => {
    expect(reconcile(dirty, { content: "a", editedOn: v1 })).toBe("unchanged");
  });

  it("ignores a version older than the one the content is based on", () => {
    expect(
      reconcile(
        { ...dirty, baseEditedOn: v2 },
        { content: "old", editedOn: v1 },
      ),
    ).toBe("unchanged");
  });

  it("ignores a scratchpad that has never been saved", () => {
    expect(reconcile(dirty, { content: "" })).toBe("unchanged");
  });

  it("adopts a newer version without unsaved changes", () => {
    expect(reconcile(clean, { content: "b", editedOn: v2 })).toBe("adopt");
  });

  it("adopts a newer version with the same content as the unsaved one", () => {
    expect(reconcile(dirty, { content: "mine", editedOn: v2 })).toBe("adopt");
  });

  it("adopts the first saved version when nothing is known yet", () => {
    expect(
      reconcile(
        { content: "", baseEditedOn: undefined, isDirty: false },
        { content: "b", editedOn: v1 },
      ),
    ).toBe("adopt");
  });

  it("reports a conflict for a newer version with unsaved changes", () => {
    expect(reconcile(dirty, { content: "theirs", editedOn: v2 })).toBe(
      "conflict",
    );
  });
});

describe("ScratchpadSession", () => {
  let save: Mock<
    (content: string, lastKnownEditedOn: string | undefined) => Promise<string>
  >;
  let loadServerVersion: Mock<() => void>;

  function createSession() {
    return new ScratchpadSession({
      userId,
      save,
      loadServerVersion,
      saveDelayMs,
    });
  }

  async function runTimers(ms = saveDelayMs) {
    await vi.advanceTimersByTimeAsync(ms);
  }

  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    save = vi.fn().mockResolvedValue(v2);
    loadServerVersion = vi.fn<() => void>();
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
      status: "saved",
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
    expect(session.getState().status).toBe("unsaved");

    await runTimers();

    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith("hi", v1);
    expect(session.getState()).toMatchObject({
      baseEditedOn: v2,
      isDirty: false,
      status: "saved",
    });
  });

  it("keeps unsaved changes as a draft until they are saved", async () => {
    const session = createSession();
    session.receiveServerVersion({ content: "", editedOn: v1 });

    session.edit("draft");

    expect(ScratchpadDraftStorage.get(userId)).toEqual({
      userId,
      content: "draft",
      baseEditedOn: v1,
    });

    await runTimers();

    expect(ScratchpadDraftStorage.get(userId)).toBeUndefined();
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
    expect(session.getState().status).toBe("saving");

    session.edit("first and more");
    resolveFirstSave(v2);
    await runTimers(0);

    expect(session.getState()).toMatchObject({
      baseEditedOn: v2,
      isDirty: true,
      status: "unsaved",
    });
    expect(ScratchpadDraftStorage.get(userId)?.baseEditedOn).toBe(v2);

    await runTimers();

    expect(save).toHaveBeenLastCalledWith("first and more", v2);
    expect(session.getState().status).toBe("saved");
  });

  it("keeps the draft when a save fails and tries again with the next change", async () => {
    save.mockRejectedValueOnce(new Error("offline"));

    const session = createSession();
    session.receiveServerVersion({ content: "", editedOn: v1 });

    session.edit("important");
    await runTimers();

    expect(session.getState().status).toBe("failed");
    expect(ScratchpadDraftStorage.get(userId)?.content).toBe("important");

    session.edit("important!");
    await runTimers();

    expect(save).toHaveBeenLastCalledWith("important!", v1);
    expect(session.getState().status).toBe("saved");
    expect(ScratchpadDraftStorage.get(userId)).toBeUndefined();
  });

  it("saves a draft left over from last time", async () => {
    ScratchpadDraftStorage.set({
      userId,
      content: "left over",
      baseEditedOn: v1,
    });

    const session = createSession();
    session.receiveServerVersion({ content: "saved", editedOn: v1 });

    expect(session.getState()).toMatchObject({
      content: "left over",
      status: "unsaved",
    });

    await runTimers(0);

    expect(save).toHaveBeenCalledWith("left over", v1);
  });

  it("ignores a draft of another user", () => {
    ScratchpadDraftStorage.set({
      userId: "someone-else",
      content: "not yours",
      baseEditedOn: v1,
    });

    const session = createSession();
    session.receiveServerVersion({ content: "saved", editedOn: v1 });

    expect(session.getState().content).toBe("saved");
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

  describe("with changes saved elsewhere while there are unsaved ones here", () => {
    let session: ScratchpadSession;

    beforeEach(() => {
      session = createSession();
      session.receiveServerVersion({ content: "old", editedOn: v1 });
      session.edit("mine");
      session.receiveServerVersion({ content: "theirs", editedOn: v2 });
    });

    it("asks instead of dropping either", async () => {
      expect(session.getState()).toMatchObject({
        content: "mine",
        conflict: { content: "theirs", editedOn: v2 },
      });

      await runTimers();

      expect(save).not.toHaveBeenCalled();
    });

    it("overwrites theirs when keeping mine", async () => {
      session.keepMine();
      await runTimers(0);

      expect(save).toHaveBeenCalledWith("mine", v2);
      expect(session.getState()).toMatchObject({
        content: "mine",
        conflict: undefined,
        status: "saved",
      });
    });

    it("drops mine when taking theirs", async () => {
      const { revision } = session.getState();

      session.takeTheirs();
      await runTimers();

      expect(save).not.toHaveBeenCalled();
      expect(session.getState()).toMatchObject({
        content: "theirs",
        baseEditedOn: v2,
        isDirty: false,
        conflict: undefined,
        revision: revision + 1,
      });
      expect(ScratchpadDraftStorage.get(userId)).toBeUndefined();
    });
  });

  it("asks for the version a save collided with and lets the user decide", async () => {
    save.mockRejectedValueOnce(new ConflictError("conflict"));

    const session = createSession();
    session.receiveServerVersion({ content: "old", editedOn: v1 });

    session.edit("mine");
    await runTimers();

    expect(loadServerVersion).toHaveBeenCalled();
    expect(session.getState()).toMatchObject({
      content: "mine",
      isDirty: true,
      status: "unsaved",
    });

    session.receiveServerVersion({ content: "theirs", editedOn: v2 });

    expect(session.getState().conflict).toEqual({
      content: "theirs",
      editedOn: v2,
    });
  });

  it("asks when a draft left over from last time collides with a newer version", async () => {
    ScratchpadDraftStorage.set({
      userId,
      content: "left over",
      baseEditedOn: v1,
    });

    const session = createSession();
    session.receiveServerVersion({ content: "newer", editedOn: v2 });
    await runTimers();

    expect(save).not.toHaveBeenCalled();
    expect(session.getState()).toMatchObject({
      content: "left over",
      conflict: { content: "newer", editedOn: v2 },
    });
  });

  it("clears the content and saves that", async () => {
    const session = createSession();
    session.receiveServerVersion({ content: "something", editedOn: v1 });
    const { revision } = session.getState();

    session.clear();
    await runTimers();

    expect(save).toHaveBeenCalledWith("", v1);
    expect(session.getState()).toMatchObject({
      content: "",
      revision: revision + 1,
    });
  });

  it("saves pending changes right away when disposed", async () => {
    const session = createSession();
    session.receiveServerVersion({ content: "", editedOn: v1 });

    session.edit("leaving");
    session.dispose();
    await runTimers(0);

    expect(save).toHaveBeenCalledWith("leaving", v1);
  });
});
