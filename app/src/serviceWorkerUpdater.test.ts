vi.mock("./env/envSettings", () => ({
  envSettings: { isDev: false },
}));

class FakeWorker extends EventTarget {
  postMessage = vi.fn();

  constructor(public state: ServiceWorkerState) {
    super();
  }

  moveTo(state: ServiceWorkerState) {
    this.state = state;
    this.dispatchEvent(new Event("statechange"));
  }
}

interface IFakeRegistration {
  update: () => Promise<void>;
  installing: FakeWorker | null;
  waiting: FakeWorker | null;
}

describe("applyNewVersion", () => {
  const reload = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    reload.mockClear();
    vi.stubGlobal("location", { reload });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("should reload when service workers are not supported", async () => {
    vi.stubGlobal("navigator", {});
    const { applyNewVersion } = await import("./serviceWorkerUpdater");

    await applyNewVersion();

    expect(reload).toHaveBeenCalledOnce();
  });

  it("should reload when there is no new worker", async () => {
    const applyNewVersion = await loadWith({
      update: () => Promise.resolve(),
      installing: null,
      waiting: null,
    });

    await applyNewVersion();

    expect(reload).toHaveBeenCalledOnce();
  });

  it("should activate a waiting worker before reloading", async () => {
    const worker = new FakeWorker("installed");
    const applyNewVersion = await loadWith({
      update: () => Promise.resolve(),
      installing: null,
      waiting: worker,
    });

    const applied = applyNewVersion();

    await vi.waitFor(() =>
      expect(worker.postMessage).toHaveBeenCalledWith({ type: "SKIP_WAITING" }),
    );
    expect(reload).not.toHaveBeenCalled();

    worker.moveTo("activated");
    await applied;

    expect(reload).toHaveBeenCalledOnce();
  });

  it("should wait for a worker that is still installing", async () => {
    const worker = new FakeWorker("installing");
    const registration: IFakeRegistration = {
      update: () => Promise.resolve(),
      installing: worker,
      waiting: null,
    };
    const applyNewVersion = await loadWith(registration);

    const applied = applyNewVersion();

    await flushPromises();
    expect(worker.postMessage).not.toHaveBeenCalled();

    registration.installing = null;
    registration.waiting = worker;
    worker.moveTo("installed");

    await vi.waitFor(() => expect(worker.postMessage).toHaveBeenCalled());
    worker.moveTo("activated");
    await applied;

    expect(reload).toHaveBeenCalledOnce();
  });

  // The reload is what brings the new version, so nothing that goes wrong with
  // the worker may keep it from happening.
  it("should reload when the new worker fails to install", async () => {
    const worker = new FakeWorker("installing");
    const registration: IFakeRegistration = {
      update: () => Promise.resolve(),
      installing: worker,
      waiting: null,
    };
    const applyNewVersion = await loadWith(registration);

    const applied = applyNewVersion();

    await flushPromises();
    expect(reload).not.toHaveBeenCalled();

    registration.installing = null;
    worker.moveTo("redundant");
    await applied;

    expect(reload).toHaveBeenCalledOnce();
  });

  it("should reload when checking for a new worker fails", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const applyNewVersion = await loadWith({
      update: () => Promise.reject(new TypeError("Failed to fetch")),
      installing: null,
      waiting: null,
    });

    await applyNewVersion();

    expect(reload).toHaveBeenCalledOnce();
  });

  it("should reload when the new worker never takes over", async () => {
    vi.useFakeTimers();
    const worker = new FakeWorker("installed");
    const applyNewVersion = await loadWith({
      update: () => Promise.resolve(),
      installing: null,
      waiting: worker,
    });

    const applied = applyNewVersion();

    await vi.advanceTimersByTimeAsync(19_999);
    expect(reload).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    await applied;

    expect(reload).toHaveBeenCalledOnce();
  });
});

async function loadWith(registration: IFakeRegistration) {
  vi.stubGlobal("navigator", {
    serviceWorker: { register: () => Promise.resolve(registration) },
  });

  return (await import("./serviceWorkerUpdater")).applyNewVersion;
}

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve));
}
