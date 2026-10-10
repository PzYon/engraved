import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render, screen } from "@testing-library/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import {
  useItemAction,
  useOpenActionKey,
  validateAppSearch,
} from "./searchParamHooks";

const rendered = vi.fn();

// Stands in for something that is rendered once per item of a list.
const Item = React.memo(({ id }: { id: string }) => {
  const openActionKey = useOpenActionKey(id);
  rendered(id);

  return <div>{`${id}: ${openActionKey ?? "nothing open"}`}</div>;
});

let itemAction: ReturnType<typeof useItemAction> | undefined;

const ItemActionUser = React.memo(() => {
  itemAction = useItemAction();
  rendered("item action user");

  return null;
});

async function renderWithRouter(initialUrl: string) {
  const rootRoute = createRootRoute({
    validateSearch: validateAppSearch,
    component: () => (
      <>
        <Item id="one" />
        <Item id="two" />
        <ItemActionUser />
      </>
    ),
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([
      createRoute({ getParentRoute: () => rootRoute, path: "/" }),
    ]),
    history: createMemoryHistory({ initialEntries: [initialUrl] }),
  });

  render(<RouterProvider router={router} />);
  await screen.findByText(/^one:/);

  return router;
}

describe("searchParamHooks", () => {
  beforeEach(() => {
    rendered.mockClear();
    itemAction = undefined;
  });

  describe("useOpenActionKey", () => {
    it("returns the action that is open for its item", async () => {
      await renderWithRouter("/?selected-item=one&action-key=delete");

      expect(screen.getByText("one: delete")).toBeTruthy();
      expect(screen.getByText("two: nothing open")).toBeTruthy();
    });

    // With an item per row of a list, opening an action for one of them must
    // not render all the others.
    it("renders only the item an action is opened for", async () => {
      const router = await renderWithRouter("/");
      rendered.mockClear();

      await act(() =>
        router.navigate({
          to: "/",
          search: { "selected-item": "two", "action-key": "schedule" },
        }),
      );

      expect(screen.getByText("two: schedule")).toBeTruthy();
      expect(rendered.mock.calls).toEqual([["two"]]);
    });

    it("does not render for other changes of the URL", async () => {
      const router = await renderWithRouter("/");
      rendered.mockClear();

      await act(() => router.navigate({ to: "/", search: { q: "text" } }));

      expect(router.state.location.search).toEqual({ q: "text" });
      expect(rendered).not.toHaveBeenCalled();
    });
  });

  describe("useItemAction", () => {
    it("reads the params that are in the URL when it is asked", async () => {
      const router = await renderWithRouter("/");

      await act(() =>
        router.navigate({
          to: "/",
          search: { "selected-item": "one", "action-key": "edit" },
        }),
      );

      expect(itemAction!.getParams()).toEqual({
        "selected-item": "one",
        "action-key": "edit",
      });
    });

    it("closes the open action and keeps the other params", async () => {
      const router = await renderWithRouter(
        "/?selected-item=one&action-key=delete&q=text",
      );

      await act(async () => itemAction!.closeAction());

      expect(router.state.location.search).toEqual({ q: "text" });
    });
  });
});
