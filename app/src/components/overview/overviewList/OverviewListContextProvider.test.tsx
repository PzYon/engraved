import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render } from "@testing-library/react";
import { OverviewListContextProvider } from "./OverviewListContextProvider";
import {
  IOverviewListContext,
  useOverviewListContext,
} from "./OverviewListContext";

const router = vi.hoisted(() => ({
  navigate: vi.fn(),
  searchString: "",
  setAppAlert: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => router.navigate,
  useRouterState: () => router.searchString,
}));

vi.mock("../../../AppContext", () => ({
  useAppContext: () => ({ setAppAlert: router.setAppAlert }),
}));

function renderProvider() {
  let context: IOverviewListContext | undefined;

  const ContextReader = () => {
    context = useOverviewListContext();
    return null;
  };

  render(
    <OverviewListContextProvider items={[{ id: "one" }, { id: "two" }]}>
      <ContextReader />
    </OverviewListContextProvider>,
  );

  return () => context!;
}

describe("OverviewListContextProvider", () => {
  beforeEach(() => {
    router.navigate.mockClear();
    router.searchString = "";
  });

  describe("removeItemParamsFromUrl", () => {
    // It is called whenever the focus moves, and a navigation - even one to
    // the current URL - makes the router go through a complete load.
    it("does not navigate when the URL has no item params", () => {
      const getContext = renderProvider();

      act(() => getContext().removeItemParamsFromUrl());

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it("removes the item params from the URL when there are some", () => {
      router.searchString = "?selected-item=one&action-key=delete&q=text";
      const getContext = renderProvider();

      act(() => getContext().removeItemParamsFromUrl());

      expect(router.navigate).toHaveBeenCalledTimes(1);

      const { search } = router.navigate.mock.calls[0][0];
      expect(
        search({ "selected-item": "one", "action-key": "delete", q: "text" }),
      ).toEqual({ q: "text" });
    });
  });
});
