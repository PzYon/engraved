import { act, renderHook } from "@testing-library/react";
import { applyNewVersion } from "./serviceWorkerUpdater";
import { useApplyNewVersion } from "./useApplyNewVersion";

vi.mock("./serviceWorkerUpdater", () => ({
  applyNewVersion: vi.fn(() => new Promise<void>(() => {})),
}));

describe("useApplyNewVersion", () => {
  beforeEach(() => {
    vi.mocked(applyNewVersion).mockClear();
  });

  it("should not be applying before apply is called", () => {
    const { result } = renderHook(() => useApplyNewVersion());

    expect(result.current.isApplying).toBe(false);
    expect(applyNewVersion).not.toHaveBeenCalled();
  });

  it("should be applying while the new version is being applied", () => {
    const { result } = renderHook(() => useApplyNewVersion());

    act(() => result.current.apply());

    expect(result.current.isApplying).toBe(true);
    expect(applyNewVersion).toHaveBeenCalledOnce();
  });

  it("should apply the new version only once", () => {
    const { result } = renderHook(() => useApplyNewVersion());

    act(() => result.current.apply());
    act(() => result.current.apply());

    expect(applyNewVersion).toHaveBeenCalledOnce();
  });
});
