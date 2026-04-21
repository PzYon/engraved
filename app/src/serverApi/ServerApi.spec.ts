import { ServerApi } from "./ServerApi";

describe("ServerApi", () => {
  describe("clearBackendCache", () => {
    it("should call system configuration clear-cache endpoint", async () => {
      const executeRequestSpy = vi
        .spyOn(
          ServerApi as unknown as {
            executeRequest: (...args: unknown[]) => Promise<void>;
          },
          "executeRequest",
        )
        .mockResolvedValue(undefined);

      await ServerApi.clearBackendCache();

      expect(executeRequestSpy).toHaveBeenCalledWith(
        "/system_config/clear-cache",
        "POST",
      );
    });
  });
});
