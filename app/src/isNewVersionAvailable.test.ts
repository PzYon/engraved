import { isNewVersionAvailable } from "./isNewVersionAvailable";

describe("isNewVersionAvailable", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should report a new version when another one is deployed", async () => {
    stubFetch(() => Promise.resolve(new Response('{"version":"2"}')));

    expect(await isNewVersionAvailable("1")).toBe(true);
  });

  it("should not report a new version when the running one is deployed", async () => {
    stubFetch(() => Promise.resolve(new Response('{"version":"1"}')));

    expect(await isNewVersionAvailable("1")).toBe(false);
  });

  it("should not report a new version when the server cannot be reached", async () => {
    stubFetch(() => Promise.reject(new TypeError("Failed to fetch")));

    expect(await isNewVersionAvailable("1")).toBe(false);
  });

  // A host that does not know version.json answers with its fallback page.
  it("should not report a new version when the answer is not the version file", async () => {
    stubFetch(() => Promise.resolve(new Response("<!doctype html>")));

    expect(await isNewVersionAvailable("1")).toBe(false);
  });

  it("should bypass the HTTP cache", async () => {
    const fetch = stubFetch(() =>
      Promise.resolve(new Response('{"version":"1"}')),
    );

    await isNewVersionAvailable("1");

    expect(fetch).toHaveBeenCalledWith("/version.json", { cache: "no-store" });
  });
});

function stubFetch(implementation: () => Promise<Response>) {
  const fetch = vi.fn(implementation);
  vi.stubGlobal("fetch", fetch);
  return fetch;
}
